import {
    ADMIN_ROLE,
    MODERATOR_ROLE
} from './roles.js';

const commandConfig = {
    addRole: {
        file: '../commands/roles/add-role.js',
        label: 'Add Role',
        description: 'Adds a role to a user.',
        aliases: ['!addrole', '!give'],
        usage: '!addrole @user @role',
        permissions: [ADMIN_ROLE, MODERATOR_ROLE]
    },
    banUser: {
        file: '../commands/moderation/ban-user.js',
        label: 'Ban User',
        description: 'Bans a user from the server.',
        aliases: ['!ban'],
        usage: '!ban @user OR !ban <userID>',
        permissions: [ADMIN_ROLE]
    },
    clearMessages: {
        file: '../commands/utility/clear-messages.js',
        label: 'Clear Messages',
        description: 'Clears recent messages (under 14 days).',
        aliases: ['!clear', '!clean', '!delete'],
        usage: '!clear <amount>',
        permissions: [ADMIN_ROLE, MODERATOR_ROLE]
    },
    clearOldMessages: {
        file: '../commands/utility/clear-old-messages.js',
        label: 'Clear Old Messages',
        description: 'Clears old messages (above 14 days).',
        aliases: ['!clearold', '!cleanold', '!deleteold'],
        usage: '!clearold <amount>',
        permissions: [ADMIN_ROLE, MODERATOR_ROLE]
    },
    demoteUser: {
        file: '../commands/roles/demote-user.js',
        label: 'Demote User',
        description: 'Demotes a user to a lower rank.',
        aliases: ['!demote', '!rankdown'],
        usage: '!demote @user',
        permissions: [ADMIN_ROLE]
    },
    kickUser: {
        file: '../commands/moderation/kick-user.js',
        label: 'Kick User',
        description: 'Kicks a user from the server.',
        aliases: ['!kick'],
        usage: '!kick @user',
        permissions: [ADMIN_ROLE]
    },
    listUsers: {
        file: '../commands/info/list-users.js',
        label: 'List Users',
        description: 'Lists all users in the server, their IDs and roles.',
        aliases: ['!listusers', '!list'],
        usage: '!listusers',
        permissions: [ADMIN_ROLE, MODERATOR_ROLE]
    },
    muteUser: {
        file: '../commands/moderation/mute-user.js',
        label: 'Mute User',
        description: 'Mutes a user, text and voice chat are disabled for them.',
        aliases: ['!mute'],
        usage: '!mute @user',
        permissions: [ADMIN_ROLE, MODERATOR_ROLE]
    },
    postMessage: {
        file: '../commands/utility/post-message.js',
        label: 'Post Message',
        description: 'Posts a message to the specified channel.',
        aliases: ['!post'],
        usage: '!post #channel <text>',
        permissions: [ADMIN_ROLE]
    },
    promoteUser: {
        file: '../commands/roles/promote-user.js',
        label: 'Promote User',
        description: 'Promotes a user to a higher rank.',
        aliases: ['!promote', '!rankup'],
        usage: '!promote @user',
        permissions: [ADMIN_ROLE]
    },
    removeRole: {
        file: '../commands/roles/remove-role.js',
        label: 'Remove Role',
        description: 'Removes a role from a user.',
        aliases: ['!removerole', '!take'],
        usage: '!removerole @user @role',
        permissions: [ADMIN_ROLE, MODERATOR_ROLE]
    },
    resyncDatabase: {
        file: '../commands/utility/resync-database.js',
        label: 'Resync Database',
        description: 'Manually resyncs the database with the current server data.',
        aliases: ['!resyncdb', '!resyncdatabase'],
        usage: '!resyncdb',
        permissions: [ADMIN_ROLE, MODERATOR_ROLE]
    },
    showUserAvatar: {
        file: '../commands/info/show-user-avatar.js',
        label: 'Show User Avatar',
        description: 'Shows the avatar of a user.',
        aliases: ['!avatar', '!icon'],
        usage: '!avatar OR !avatar @user',
        permissions: []
    },
    showUserInfo: {
        file: '../commands/info/show-user-info.js',
        label: 'Show User Info',
        description: 'Shows detailed information about a user.',
        aliases: ['!info', '!userinfo'],
        usage: '!info OR !info @user',
        permissions: []
    },
    toggleDuelistRole: {
        file: '../commands/roles/toggle-duelist-role.js',
        label: 'Toggle Duelist Role',
        description: 'Toggles the duelist role for a user.',
        aliases: ['!duelist'],
        usage: '!duelist',
        permissions: []
    },
    unmuteUser: {
        file: '../commands/moderation/unmute-user.js',
        label: 'Unmute User',
        description: 'Unmutes a previously muted user.',
        aliases: ['!unmute'],
        usage: '!unmute @user',
        permissions: [ADMIN_ROLE, MODERATOR_ROLE]
    }
};

export default commandConfig;
