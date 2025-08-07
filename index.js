require('dotenv').config({ path: './data/.env' });
const { Client, GatewayIntentBits } = require('discord.js');
const { syncDatabase } = require('./db');
const guildMemberAdd = require('./events/guild-member-add');
const messageCreate = require('./events/message-create');
const ready = require('./events/ready');

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
