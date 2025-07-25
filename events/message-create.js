const banUser = require('../commands/ban-user');
const clearMessages = require('../commands/clear-messages');
const clearOldMessages = require('../commands/clear-old-messages');
const demoteUser = require('../commands/demote-user');
const kickUser = require('../commands/kick-user');
const listUsers = require('../commands/list-users');
const muteUser = require('../commands/mute-user');
const postMessage = require('../commands/post-message');
const promoteUser = require('../commands/promote-user');
const resyncDatabase = require('../commands/resync-database');
const showUserAvatar = require('../commands/show-user-avatar');
const showUserInfo = require('../commands/show-user-info');
const toggleDuelistRole = require('../commands/toggle-duelist-role');
const unmuteUser = require('../commands/unmute-user');

module.exports = (client) => {
    client.on('messageCreate', async (message) => {
        if (message.author.bot) return;

        const args = message.content.trim().split(/ +/);
        const command = args[0];

        if (command === '!ban') return await banUser(message);
        if (command === '!clear' || command === '!clean' || command === '!delete') return await clearMessages(message);
        if (command === '!clearold' || command === '!cleanold' || command === '!deleteold') return await clearOldMessages(message);
        if (command === '!demote' || command === '!rankdown') return await demoteUser(message);
        if (command === '!kick') return await kickUser(message);
        if (command === '!list' || command === '!listusers') return await listUsers(message);
        if (command === '!mute') return await muteUser(message);
        if (command === '!post') return await postMessage(message);
        if (command === '!promote' || command === '!rankup') return await promoteUser(message);
        if (command === '!resyncdb' || command === '!resyncdatabase') return await resyncDatabase(message);
        if (command === '!avatar' || command === '!icon') return await showUserAvatar(message);
        if (command === '!info' || command === '!userinfo') return await showUserInfo(message);
        if (command === '!duelist') return await toggleDuelistRole(message);
        if (command === '!unmute') return await unmuteUser(message);
    });
};
