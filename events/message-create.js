const ban = require('../commands/ban-user');
const clear = require('../commands/clear-messages');
const clearold = require('../commands/clear-old-messages');
const demote = require('../commands/demote-user');
const kick = require('../commands/kick-user');
const mute = require('../commands/mute-user');
const promote = require('../commands/promote-user');
const showAvatar = require('../commands/show-user-avatar');
const showUserInfo = require('../commands/show-user-info');
const duelist = require('../commands/toggle-duelist-role');
const unmute = require('../commands/unmute-user');

module.exports = (client) => {
    client.on('messageCreate', async (message) => {
        if (message.author.bot) return;

        const args = message.content.trim().split(/ +/);
        const command = args[0];

        if (command === '!ban') return await ban(message);
        if (command === '!clear' || command === '!clean' || command === '!delete') return await clear(message);
        if (command === '!clearold' || command === '!cleanold' || command === '!deleteold') return await clearold(message);
        if (command === '!demote' || command === '!rankdown') return await demote(message);
        if (command === '!kick') return await kick(message);
        if (command === '!mute') return await mute(message);
        if (command === '!promote' || command === '!rankup') return await promote(message);
        if (command === '!avatar' || command === '!icon') return await showAvatar(message);
        if (command === '!info' || command === '!userinfo') return await showUserInfo(message);
        if (command === '!duelist') return await duelist(message);
        if (command === '!unmute') return await unmute(message);
    });
};
