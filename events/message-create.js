const promote = require('../commands/promote-user');
const demote = require('../commands/demote-user');
const kick = require('../commands/kick-user');
const ban = require('../commands/ban-user');
const duelist = require('../commands/toggle-duelist-role');
const clean = require('../commands/clear-messages');
const showAvatar = require('../commands/show-user-avatar');
const showUserInfo = require('../commands/show-user-info');

module.exports = (client) => {
    client.on('messageCreate', async (message) => {
        if (message.author.bot) return;

        const args = message.content.trim().split(/ +/);
        const command = args[0];

        if (command === '!promote') return await promote(message);
        if (command === '!demote') return await demote(message);
        if (command === '!kick') return await kick(message);
        if (command === '!ban') return await ban(message);
        if (command === '!duelist') return await duelist(message);
        if (command === '!clear' || command === '!clean' || command === '!delete') return await clean(message);
        if (command === '!avatar' || command === '!icon') return await showAvatar(message);
        if (command === '!info' || command === '!userinfo') return await showUserInfo(message);
    });
};
