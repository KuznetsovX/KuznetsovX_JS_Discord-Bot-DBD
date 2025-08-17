import config from '../config/index.js';
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

        try {
            await match.handler.run(message, args);
        } catch (error) {
            console.error(`❌ Error running command ${config.PREFIX}${command}:`, error);
            await message.reply('❌ An error occurred while executing this command.');
        }
    });
}
