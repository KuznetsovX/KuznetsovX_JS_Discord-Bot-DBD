import { COMMANDS, PREFIXES, OWNER_ID } from '../config/index.js';
import log from '../utils/logging/log.js';
import { checkCooldown } from '../utils/misc/command-cooldowns.js';
import { isLocked, acquireLock, releaseLock } from '../utils/misc/command-locks.js';
import { hasPermission } from '../utils/check-permissions.js';

const aliasMap = new Map();

function flattenCommands(configSection) {
    const flat = [];
    for (const key in configSection) {
        const configItem = configSection[key];
        if (configItem.file) {
            flat.push({ ...configItem, canonicalName: key });
        } else if (configItem && typeof configItem === 'object') {
            flat.push(...flattenCommands(configItem));
        }
    }
    return flat;
}

async function registerCommands() {
    const commands = flattenCommands(COMMANDS);
    await Promise.all(commands.map(async cmd => {
        const handlerModule = await import(cmd.file);
        const handler = handlerModule.default || handlerModule;
        for (const alias of cmd.aliases) {
            aliasMap.set(alias.toLowerCase(), { ...cmd, handler });
        }
    }));
}

await registerCommands();

export default function messageCreate(client) {
    client.on('messageCreate', async (message) => {
        if (message.author.bot) return;

        const content = message.content.trim();
        const usedPrefix = PREFIXES.find(prefix => content.startsWith(prefix));
        if (!usedPrefix) return;

        const args = content.slice(usedPrefix.length).trim().split(/\s+/);
        const commandInput = args.shift().toLowerCase();

        const match = aliasMap.get(commandInput);
        if (!match) return;

        if (checkCooldown(message.author.id, match.canonicalName)) {
            return message.reply('⏳ You are using this command too quickly. Please wait a few seconds.');
        }

        const lockKey = match.lock ? match.canonicalName : `${match.canonicalName}-${message.author.id}`;
        if (isLocked(lockKey)) {
            return message.reply('⏳ This command is already running. Please wait...');
        }
        acquireLock(lockKey);

        try {
            log.info(`${match.label}`, `${message.author.tag} (${message.author.id}) tried to run "${usedPrefix}${commandInput}" with args: [${args.join(' ')}]`);

            if (!hasPermission(message.member, match.permissions) && message.author.id !== OWNER_ID) {
                log.warn(`${match.label}`, `${message.author.tag} (${message.author.id}) attempted "${usedPrefix}${commandInput}" but lacks permissions`);
                return message.reply('❌ You do not have permission to use this command.');
            }

            if (match.delete) {
                await message.delete().catch(err => {
                    log.warn(`${match.label}`, `Could not delete message from ${message.author.tag} (${message.author.id}): ${err.message}`);
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
            log.action(`${match.label}`, `${message.author.tag} (${message.author.id}) successfully ran "${usedPrefix}${commandInput}"`);
        } catch (error) {
            log.error(`${match.label}`, `Error in "${usedPrefix}${commandInput}" by ${message.author.tag} (${message.author.id}): ${error.message}`);
            await message.reply('❌ An error occurred while executing this command.');
        } finally {
            releaseLock(lockKey);
        }
    });
}
