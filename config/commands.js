module.exports = {
    ban: { aliases: ['!ban'], file: '../commands/ban-user' },
    clear: { aliases: ['!clear', '!clean', '!delete'], file: '../commands/clear-messages' },
    clearold: { aliases: ['!clearold', '!cleanold', '!deleteold'], file: '../commands/clear-old-messages' },
    demote: { aliases: ['!demote'], file: '../commands/demote-user' },
    kick: { aliases: ['!kick'], file: '../commands/kick-user' },
    listusers: { aliases: ['!listusers'], file: '../commands/list-users' },
    mute: { aliases: ['!mute'], file: '../commands/mute-user' },
    post: { aliases: ['!post'], file: '../commands/post-message' },
    promote: { aliases: ['!promote'], file: '../commands/promote-user' },
    avatar: { aliases: ['!avatar', '!icon'], file: '../commands/show-user-avatar' },
    info: { aliases: ['!info', '!userinfo'], file: '../commands/show-user-info' },
    duelist: { aliases: ['!duelist'], file: '../commands/toggle-duelist-role' },
    unmute: { aliases: ['!unmute'], file: '../commands/unmute-user' }
};
