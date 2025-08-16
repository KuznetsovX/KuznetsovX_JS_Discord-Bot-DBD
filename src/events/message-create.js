import commandConfig from '../config/commands.js';

const aliasMap = new Map();

// Flatten nested command config into a simple array
function flattenCommands(configSection) {
    const flat = [];

    for (const key in configSection) {
        const config = configSection[key];

        if (config.file) {
            flat.push(config);
        } else if (config && typeof config === 'object') {
            flat.push(...flattenCommands(config));
        }
    }

    return flat;
}

// Load all commands
async function registerCommands() {
    const commands = flattenCommands(commandConfig);

    await Promise.all(commands.map(async config => {
        const handlerModule = await import(config.file);
        const handler = handlerModule.default || handler;

        for (const alias of config.aliases) {
            aliasMap.set(alias.toLowerCase(), { ...config, handler });
        }
    }));
}

// Register commands on startup
await registerCommands();

export default function messageCreate(client) {
    client.on('messageCreate', async (message) => {
        if (message.author.bot) return;

        const args = message.content.trim().split(/\s+/);
        const command = args.shift().toLowerCase();

        const match = aliasMap.get(command);
        if (!match) return;

        try {
            await match.handler.run(message, args);
        } catch (error) {
            console.error(`❌ Error running command ${command}:`, error);
            await message.reply('❌ An error occurred while executing this command.');
        }
    });
}
