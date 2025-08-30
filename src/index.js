import { DISCORD_BOT_TOKEN } from './config/index.js';
import { Client, GatewayIntentBits } from 'discord.js';
import { syncDatabase, closeDB } from './db/index.js';
import guildMemberAdd from './events/guild-member-add.js';
import messageCreate from './events/message-create.js';
import ready from './events/ready.js';
import log from './utils/logging/log.js';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ]
});

async function startBot() {
    try {
        // Sync the database
        await syncDatabase();

        // Handle ready
        client.once('ready', async () => {
            await ready(client);
        });

        // Handle new member joins
        client.on('guildMemberAdd', async (member) => {
            await guildMemberAdd(member);
        });

        // Handle incoming messages
        messageCreate(client);

        // Login to Discord
        await client.login(DISCORD_BOT_TOKEN);

    } catch (error) {
        log.error('STARTUP', `❌ Failed to start bot: ${error.message}`, error);
        process.exit(1);
    }
}

// Handle termination signals
process.on('SIGINT', async () => {
    await closeDB();
    process.exit(0);
});
process.on('SIGTERM', async () => {
    await closeDB();
    process.exit(0);
});

startBot();
