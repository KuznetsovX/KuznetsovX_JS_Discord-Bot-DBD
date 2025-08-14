import dotenv from 'dotenv';
dotenv.config({ path: './data/.env' });

import { Client, GatewayIntentBits } from 'discord.js';
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