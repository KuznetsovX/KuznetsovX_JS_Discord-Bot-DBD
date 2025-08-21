import config from '../config/index.js';
import { hasPermission } from '../utils/check-permissions.js';
import log from '../utils/logging/log.js';

const aliasMap = new Map();

// Flatten nested command config into a simple array
function flattenCommands(configSection) {
    const flat = [];

    for (const key in configSection) {
        const configItem = configSection[key];

        if (configItem.file) {
            flat.push(configItem);
        } else if (configItem && typeof configItem === 'object') {
            flat.push(...flattenCommands(configItem));
        }
    }

    return flat;
}

// Load all commands
async function registerCommands() {
    const commands = flattenCommands(config.commands);

    await Promise.all(commands.map(async cmd => {
        const handlerModule = await import(cmd.file);
        const handler = handlerModule.default || handlerModule;

        for (const alias of cmd.aliases) {
            aliasMap.set(alias.toLowerCase(), { ...cmd, handler });
        }
    }));
}

// Register commands on startup
await registerCommands();

export default function messageCreate(client) {
    client.on('messageCreate', async (message) => {
        if (message.author.bot) return;

        const content = message.content.trim();

        // Ignore messages not starting with global prefix
        if (!content.startsWith(config.PREFIX)) return;

        const args = content.slice(config.PREFIX.length).trim().split(/\s+/);
        const command = args.shift().toLowerCase();

        const match = aliasMap.get(command);
        if (!match) return;

        // Log command attempt
        log.info(`${match.label}`, `${message.author.tag} (${message.author.id}) tried to run "${config.PREFIX}${command}" with args: [${args.join(' ')}]`);

        // Check permissions before running command
        if (!hasPermission(message.member, match.permissions)) {
            log.warn(`${match.label}`, `${message.author.tag} (${message.author.id}) attempted "${config.PREFIX}${command}" but lacks permissions`);
            return message.reply('❌ You do not have permission to use this command.');
        }

        try {
            log.action(`${match.label}`, `${message.author.tag} (${message.author.id}) successfully ran "${config.PREFIX}${command}"`);

            if (match.delete) {
                await message.delete().catch(err => {
                    log.warn(`${match.label}`, `Could not delete message from ${message.author.tag} (${message.author.id}): ${err.message}`);
                });
            }

            // Run the command
            await match.handler.run(message, args);
        } catch (error) {
            log.error(`${match.label}`, `Error in "${config.PREFIX}${command}" by ${message.author.tag} (${message.author.id}): ${error.message}`);
            await message.reply('❌ An error occurred while executing this command.');
        }
    });
}
