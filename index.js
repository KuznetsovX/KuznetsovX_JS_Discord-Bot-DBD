require('dotenv').config({ path: './data/bot-token.env' });
const { Client, GatewayIntentBits } = require('discord.js');
const guildMemberAdd = require('./events/guild-member-add');
const ready = require('./events/ready');
const messageCreate = require('./events/message-create');
const { syncDatabase, syncMembersToDB } = require('./db');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Sync the database
syncDatabase();

// Call the ready event handler
client.once('ready', async () => {
    await ready(client);

    const guild = client.guilds.cache.first();

    if (!guild) {
        return console.error('❌ Bot is not in any guilds.');
    }

    await syncMembersToDB(guild);
});

// Call the guild-member-add event handler
client.on('guildMemberAdd', async (member) => {
    await guildMemberAdd(member);
});

// Call the message-create event handler
messageCreate(client);

client.login(process.env.DISCORD_BOT_TOKEN);
