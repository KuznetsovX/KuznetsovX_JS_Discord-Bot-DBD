import { ROLES } from './roles.js';

/**
 * Command configuration
 * Each command object should follow this structure:
 *
 * file         - Path to the command handler file
 * label        - Display name (used in help menus)
 * description  - Short explanation of what the command does
 * aliases      - List of alternative triggers for the command
 * usage        - Example(s) of how to use the command
 * permissions  - Array of roles required to run the command (empty = everyone can use it)
 */

const commands = {
    info: {
        help: {
            file: '../commands/info/help.js',
            label: 'Help',
            description: 'Displays a list of all commands or detailed information about a specific command.',
            aliases: ['help', 'commands', 'cmd'],
            usage: 'help OR help <command>',
            permissions: [],
        },
        listUsers: {
            file: '../commands/info/list-users.js',
            label: 'List Users',
            description: 'Lists all users in the server, their IDs and roles.',
            aliases: ['listusers', 'list'],
            usage: 'listusers',
            permissions: [ROLES.ADMIN, ROLES.MODERATOR],
        },
        showUserAvatar: {
            file: '../commands/info/show-user-avatar.js',
            label: 'Show User Avatar',
            description: 'Shows the avatar of a user.',
            aliases: ['avatar', 'icon'],
            usage: 'avatar OR avatar @user',
            permissions: [],
        },
        showUserInfo: {
            file: '../commands/info/show-user-info.js',
            label: 'Show User Info',
            description: 'Shows detailed information about a user.',
            aliases: ['info', 'userinfo'],
            usage: 'info OR info @user',
            permissions: [],
        },
    },
    moderation: {
        banUser: {
            file: '../commands/moderation/ban-user.js',
            label: 'Ban User',
            description: 'Bans a user from the server.',
            aliases: ['ban'],
            usage: 'ban @user OR ban <userID>',
            permissions: [ROLES.ADMIN],
        },
        kickUser: {
            file: '../commands/moderation/kick-user.js',
            label: 'Kick User',
            description: 'Kicks a user from the server.',
            aliases: ['kick'],
            usage: 'kick @user',
            permissions: [ROLES.ADMIN],
        },
        muteUser: {
            file: '../commands/moderation/mute-user.js',
            label: 'Mute User',
            description: 'Mutes a user, text and voice chat are disabled for them.',
            aliases: ['mute'],
            usage: 'mute @user',
            permissions: [ROLES.ADMIN, ROLES.MODERATOR],
        },
        unmuteUser: {
            file: '../commands/moderation/unmute-user.js',
            label: 'Unmute User',
            description: 'Unmutes a previously muted user.',
            aliases: ['unmute'],
            usage: 'unmute @user',
            permissions: [ROLES.ADMIN, ROLES.MODERATOR],
        },
    },
    roles: {
        addRole: {
            file: '../commands/roles/add-role.js',
            label: 'Add Role',
            description: 'Adds a role to a user.',
            aliases: ['addrole', 'give'],
            usage: 'addrole @user @role',
            permissions: [ROLES.ADMIN, ROLES.MODERATOR],
        },
        demoteUser: {
            file: '../commands/roles/demote-user.js',
            label: 'Demote User',
            description: 'Demotes a user to a lower rank.',
            aliases: ['demote', 'rankdown'],
            usage: 'demote @user',
            permissions: [ROLES.ADMIN, ROLES.MODERATOR],
        },
        promoteUser: {
            file: '../commands/roles/promote-user.js',
            label: 'Promote User',
            description: 'Promotes a user to a higher rank.',
            aliases: ['promote', 'rankup'],
            usage: 'promote @user',
            permissions: [ROLES.ADMIN, ROLES.MODERATOR],
        },
        removeRole: {
            file: '../commands/roles/remove-role.js',
            label: 'Remove Role',
            description: 'Removes a role from a user.',
            aliases: ['removerole', 'take'],
            usage: 'removerole @user @role',
            permissions: [ROLES.ADMIN, ROLES.MODERATOR],
        },
        toggleDuelistRole: {
            file: '../commands/roles/toggle-duelist-role.js',
            label: 'Toggle Duelist Role',
            description: 'Toggles the duelist role for a user.',
            aliases: ['duelist'],
            usage: 'duelist',
            permissions: [],
        },
    },
    utility: {
        clearMessages: {
            file: '../commands/utility/clear-messages.js',
            label: 'Clear Messages',
            description: 'Clears recent messages (under 14 days).',
            aliases: ['clear', 'clean', 'delete'],
            usage: 'clear <amount>',
            permissions: [ROLES.ADMIN, ROLES.MODERATOR],
        },
        clearOldMessages: {
            file: '../commands/utility/clear-old-messages.js',
            label: 'Clear Old Messages',
            description: 'Clears old messages (above 14 days).',
            aliases: ['clearold', 'cleanold', 'deleteold'],
            usage: 'clearold <amount>',
            permissions: [ROLES.ADMIN, ROLES.MODERATOR],
        },
        postMessage: {
            file: '../commands/utility/post-message.js',
            label: 'Post Message',
            description: 'Posts a message to the specified channel.',
            aliases: ['post'],
            usage: 'post #channel <text>',
            permissions: [ROLES.ADMIN],
        },
        resyncDatabase: {
            file: '../commands/utility/resync-database.js',
            label: 'Resync Database',
            description: 'Manually resyncs the database with the current server data.',
            aliases: ['resyncdb', 'resyncdatabase'],
            usage: 'resyncdb',
            permissions: [ROLES.ADMIN, ROLES.MODERATOR],
        },
    },
};

export default commands;
