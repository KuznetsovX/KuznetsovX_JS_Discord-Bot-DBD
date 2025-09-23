import { Client, GatewayIntentBits } from 'discord.js';
import { DISCORD_BOT_TOKEN } from './config/index.js';
import { syncDatabase, closeDB } from './database/index.js';
import guildMemberAdd from './events/guild-member-add.js';
import messageCreate from './events/message-create.js';
import ready from './events/ready.js';
import log from './utils/logging/log.js';
import { setBotPresence } from './utils/misc/set-bot-presence.js';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ]
});

client.isInitialized = false;

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

async function stopBot(signal) {
    try {
        log.warn('SHUTDOWN', `Caught ${signal}, shutting down bot...`);

        // Set bot presence to offline if connected
        if (client.isReady()) {
            setBotPresence(client, 'offline');
        }

        // Close database
        await closeDB();

        // Destroy Discord client
        await client.destroy();

        process.exit(0);
    } catch (error) {
        log.error('SHUTDOWN', `❌ Error during shutdown: ${error.message}`, error);
        process.exit(1);
    }
}

// Handle termination signals
process.on('SIGINT', () => stopBot('SIGINT'));
process.on('SIGTERM', () => stopBot('SIGTERM'));

startBot();
