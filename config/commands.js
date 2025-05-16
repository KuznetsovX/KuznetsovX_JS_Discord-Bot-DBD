module.exports = {
    promote: {
        aliases: ['!promote'],
        file: '../commands/promote-user'
    },
    demote: {
        aliases: ['!demote'],
        file: '../commands/demote-user'
    },
    kick: {
        aliases: ['!kick'],
        file: '../commands/kick-user'
    },
    ban: {
        aliases: ['!ban'],
        file: '../commands/ban-user'
    },
    duelist: {
        aliases: ['!duelist'],
        file: '../commands/toggle-duelist-role'
    },
    clear: {
        aliases: ['!clear', '!clean', '!delete'],
        file: '../commands/clear-messages'
    },
    avatar: {
        aliases: ['!avatar', '!icon'],
        file: '../commands/show-user-avatar'
    },
    info: {
        aliases: ['!info', '!userinfo'],
        file: '../commands/show-user-info'
    }
};
