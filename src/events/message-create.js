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

        const usedPrefix = config.PREFIXES.find(prefix => content.startsWith(prefix));
        if (!usedPrefix) return;

        const args = content.slice(usedPrefix.length).trim().split(/\s+/);
        const command = args.shift().toLowerCase();

        const match = aliasMap.get(command);
        if (!match) return;

        log.info(`${match.label}`, `${message.author.tag} (${message.author.id}) tried to run "${usedPrefix}${command}" with args: [${args.join(' ')}]`);

        if (!hasPermission(message.member, match.permissions) && message.author.id !== config.OWNER_ID) {
            log.warn(`${match.label}`, `${message.author.tag} (${message.author.id}) attempted "${usedPrefix}${command}" but lacks permissions`);
            return message.reply('❌ You do not have permission to use this command.');
        }

        try {
            log.action(`${match.label}`, `${message.author.tag} (${message.author.id}) successfully ran "${usedPrefix}${command}"`);

            if (match.delete) {
                await message.delete().catch(err => {
                    log.warn(
                        `${match.label}`,
                        `Could not delete message from ${message.author.tag} (${message.author.id}): ${err.message}`
                    );
                });

                message._send = (content) => {
                    if (typeof content === "string") {
                        return message.channel.send(`${message.author}, ${content}`);
                    } else {
                        return message.channel.send({
                            ...content,
                            content: `${message.author}${content.content ? " " + content.content : ""}`
                        });
                    }
                };

            } else {
                message._send = (content) =>
                    message.reply({
                        ...(typeof content === "string" ? { content } : content)
                    });
            }

            await match.handler.run(message, args);
        } catch (error) {
            log.error(`${match.label}`, `Error in "${usedPrefix}${command}" by ${message.author.tag} (${message.author.id}): ${error.message}`);
            await message.reply('❌ An error occurred while executing this command.');
        }
    });
}
