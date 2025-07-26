const path = require('path');
const commandConfig = require('../config/commands');

const aliasMap = new Map();

for (const key in commandConfig) {
    const config = commandConfig[key];
    const handler = require(config.file);

    for (const alias of config.aliases) {
        aliasMap.set(alias.toLowerCase(), {
            ...config,
            handler
        });
    }
}

module.exports = (client) => {
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
