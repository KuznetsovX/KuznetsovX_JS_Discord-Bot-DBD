import commandConfig from '../config/commands.js';

const aliasMap = new Map();

for (const key in commandConfig) {
    const config = commandConfig[key];
    const handlerModule = await import(config.file);
    const handler = handlerModule.default || handlerModule;

    for (const alias of config.aliases) {
        aliasMap.set(alias.toLowerCase(), {
            ...config,
            handler
        });
    }
}

export default function messageCreate(client) {
    client.on('messageCreate', async (message) => {
        if (message.author.bot) return;

        const args = message.content.trim().split(/\s+/);
        const command = args[0].toLowerCase();

        const match = aliasMap.get(command);
        if (!match) return;

        try {
            await match.handler.run(message, args);
        } catch (error) {
            console.error(`❌ Error running command ${command}:`, error);
            await message.reply('❌ An error occurred while executing this command.');
        }
    });
};
