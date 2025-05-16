require('dotenv').config({ path: './data/bot-token.env' });
const { Client, GatewayIntentBits } = require('discord.js');
const guildMemberAdd = require('./events/guild-member-add');
const ready = require('./events/ready');
const messageCreate = require('./events/message-create');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Call the ready event handler
client.once('ready', async () => {
    await ready(client);
});

// Call the guild-member-add event handler
client.on('guildMemberAdd', async (member) => {
    await guildMemberAdd(member);
});

// Call the message-create event handler
messageCreate(client);

client.login(process.env.DISCORD_BOT_TOKEN);
