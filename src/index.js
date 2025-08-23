import dotenv from 'dotenv';
dotenv.config();

import { Client, GatewayIntentBits } from 'discord.js';
import { sequelize } from './db/user-model.js';
import { syncDatabase } from './db/index.js';
import guildMemberAdd from './events/guild-member-add.js';
import messageCreate from './events/message-create.js';
import ready from './events/ready.js';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ]
});

// Sync the database
syncDatabase();

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
client.login(process.env.DISCORD_BOT_TOKEN);

// Properly close DB connection on exit
const closeDB = async () => {
    try {
        await sequelize.close();
        console.log('✅ Database connection closed.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error closing database connection:', error);
        process.exit(1);
    }
};

// Listen for termination signals
process.on('SIGINT', closeDB);   // Ctrl+C
process.on('SIGTERM', closeDB);  // Termination
process.on('exit', closeDB);     // Node exit
