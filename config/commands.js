module.exports = {
    banUser: {
        aliases: ['!ban'],
        file: '../commands/ban-user',
        description: 'Bans a user from the server.',
        usage: '!ban @user OR !ban <userID>'
    },
    clearMessages: {
        aliases: ['!clear', '!clean', '!delete'],
        file: '../commands/clear-messages',
        description: 'Clears recent messages (under 14 days).',
        usage: '!clear <amount>'
    },
    clearOldMessages: {
        aliases: ['!clearold', '!cleanold', '!deleteold'],
        file: '../commands/clear-old-messages',
        description: 'Clears old messages (above 14 days).',
        usage: '!clearold <amount>'
    },
    demoteUser: {
        aliases: ['!demote', '!rankdown'],
        file: '../commands/demote-user',
        description: 'Demotes a user to a lower rank or role.',
        usage: '!demote @user'
    },
    kickUser: {
        aliases: ['!kick'],
        file: '../commands/kick-user',
        description: 'Kicks a user from the server.',
        usage: '!kick @user'
    },
    listUsers: {
        aliases: ['!listusers', '!list'],
        file: '../commands/list-users',
        description: 'Lists all users in the server, their IDs and roles.',
        usage: '!list'
    },
    muteUser: {
        aliases: ['!mute'],
        file: '../commands/mute-user',
        description: 'Mutes a user, text and voice chat are disabled for them.',
        usage: '!mute @user'
    },
    postMessage: {
        aliases: ['!post'],
        file: '../commands/post-message',
        description: 'Posts a message to the specified channel.',
        usage: '!post #channel <text>'
    },
    promoteUser: {
        aliases: ['!promote', '!rankup'],
        file: '../commands/promote-user',
        description: 'Promotes a user to a higher rank or role.',
        usage: '!promote @user'
    },
    resyncDatabase: {
        aliases: ['!resyncdb', '!resyncdatabase'],
        file: '../commands/resync-database',
        description: 'Manually resyncs the database with the current server data.',
        usage: '!resyncdb'
    },
    showUserAvatar: {
        aliases: ['!avatar', '!icon'],
        file: '../commands/show-user-avatar',
        description: 'Shows the avatar of a user.',
        usage: '!avatar OR !avatar @user'
    },
    showUserInfo: {
        aliases: ['!info', '!userinfo'],
        file: '../commands/show-user-info',
        description: 'Shows detailed information about a user.',
        usage: '!info OR !info @user'
    },
    toggleDuelistRole: {
        aliases: ['!duelist'],
        file: '../commands/toggle-duelist-role',
        description: 'Toggles the duelist role for a user.',
        usage: '!duelist OR !duelist @user'
    },
    unmuteUser: {
        aliases: ['!unmute'],
        file: '../commands/unmute-user',
        description: 'Unmutes a previously muted user.',
        usage: '!unmute @user'
    }
};
