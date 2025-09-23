import ROLES from './roles.js';

/**
 * @typedef {Object} Command
 * @property {string} file - Path to the command handler file
 * @property {string} label - Display name (used in help menus)
 * @property {string} description - Short explanation of what the command does
 * @property {string[]} aliases - List of alternative triggers for the command
 * @property {string[]} usage - Example(s) of how to use the command
 * @property {string[]} permissions - Array of roles required to run the command (empty = everyone can use it)
 * @property {boolean} delete - Whether the bot should delete the user's message
 * @property {boolean} lock - Prevents concurrent execution; if set to true, only one instance of this command can run at a time
 * @property {number} [warns] - Maximum number of warnings before action is taken (optional)
 */

/**
 * @typedef {Object.<string, Record<string, Command>>} CommandCategory
 */

/** @type {CommandCategory} */
const COMMANDS = {
    admin: {
        label: 'Administration',
        commands: {
            resyncDatabase: {
                file: '../commands/admin/resync-database.js',
                label: 'Resync Database',
                description: 'Manually resyncs the database with the current server data.',
                aliases: ['resyncdatabase', 'resyncdb'],
                usage: ['resyncdatabase'],
                permissions: [ROLES.ADMIN.id],
                delete: true,
                lock: true,
            },
            updateBotPresence: {
                file: '../commands/admin/update-bot-presence.js',
                label: 'Update Bot Presence',
                description: 'Updates the bot\'s presence status.',
                aliases: ['presence', 'pres'],
                usage: ['presence <status>'],
                permissions: [ROLES.ADMIN.id],
                delete: false,
                lock: true,
            },
        },
    },
    info: {
        label: 'Information',
        commands: {
            help: {
                file: '../commands/info/help.js',
                label: 'Help',
                description: 'Displays a list of all commands or detailed information about a specific command.',
                aliases: ['help', 'commands', 'cmd'],
                usage: ['help', 'help <command>'],
                permissions: [],
                delete: false,
                lock: false,
            },
            listUsers: {
                file: '../commands/info/list-users.js',
                label: 'List Users',
                description: 'Lists all users in the server, their IDs and roles.',
                aliases: ['listusers', 'list'],
                usage: ['listusers'],
                permissions: [ROLES.ADMIN.id, ROLES.MODERATOR.id],
                delete: true,
                lock: false,
            },
            showMaps: {
                file: '../commands/info/show-maps.js',
                label: 'Show Maps',
                description: 'Displays a list of all maps.',
                aliases: ['maps', 'map'],
                usage: ['maps', 'maps <map>'],
                permissions: [],
                delete: false,
                lock: false,
            },
            showRoleInfo: {
                file: '../commands/info/show-role-info.js',
                label: 'Show Role Info',
                description: 'Shows detailed information about a specific role.',
                aliases: ['roles', 'roleinfo'],
                usage: ['roles', 'roles @role'],
                permissions: [],
                delete: true, // Should always be true to prevent role pings
                lock: false,
            },
            showTiles: {
                file: '../commands/info/show-tiles.js',
                label: 'Show Tiles',
                description: 'Displays a list of common tiles.',
                aliases: ['tiles', 'tile', 'commontiles'],
                usage: ['tiles', 'tiles <tile>'],
                permissions: [],
                delete: false,
                lock: false,
            },
            showUserAvatar: {
                file: '../commands/info/show-user-avatar.js',
                label: 'Show User Avatar',
                description: 'Shows the avatar of a user.',
                aliases: ['avatar', 'icon'],
                usage: ['avatar', 'avatar @user'],
                permissions: [],
                delete: true, // Should always be true to prevent user pings
                lock: false,
            },
            showUserInfo: {
                file: '../commands/info/show-user-info.js',
                label: 'Show User Info',
                description: 'Shows detailed information about a user.',
                aliases: ['info', 'userinfo'],
                usage: ['info', 'info @user'],
                permissions: [],
                delete: true, // Should always be true to prevent user pings
                lock: false,
            },
        },
    },
    moderation: {
        label: 'Moderation',
        commands: {
            banUser: {
                file: '../commands/moderation/ban-user.js',
                label: 'Ban User',
                description: 'Bans a user from the server.',
                aliases: ['ban'],
                usage: ['ban @user', 'ban <userID>'],
                permissions: [ROLES.ADMIN.id],
                delete: false,
                lock: true,
            },
            kickUser: {
                file: '../commands/moderation/kick-user.js',
                label: 'Kick User',
                description: 'Kicks a user from the server.',
                aliases: ['kick'],
                usage: ['kick @user'],
                permissions: [ROLES.ADMIN.id],
                delete: false,
                lock: true,
            },
            muteUser: {
                file: '../commands/moderation/mute-user.js',
                label: 'Mute User',
                description: 'Mutes a user, text and voice chat are disabled for them.',
                aliases: ['mute'],
                usage: ['mute @user'],
                permissions: [ROLES.ADMIN.id, ROLES.MODERATOR.id],
                delete: false,
                lock: true,
            },
            unmuteUser: {
                file: '../commands/moderation/unmute-user.js',
                label: 'Unmute User',
                description: 'Unmutes a previously muted user.',
                aliases: ['unmute'],
                usage: ['unmute @user'],
                permissions: [ROLES.ADMIN.id, ROLES.MODERATOR.id],
                delete: false,
                lock: true,
            },
            unwarnUser: {
                file: '../commands/moderation/unwarn-user.js',
                label: 'Unwarn User',
                description: 'Removes a warning from a user.',
                aliases: ['unwarn'],
                usage: ['unwarn @user'],
                permissions: [ROLES.ADMIN.id, ROLES.MODERATOR.id],
                delete: false,
                lock: true,
            },
            warnUser: {
                file: '../commands/moderation/warn-user.js',
                label: 'Warn User',
                description: 'Issues a warning to a user.',
                aliases: ['warn'],
                usage: ['warn @user', 'warn @user [reason]'],
                permissions: [ROLES.ADMIN.id, ROLES.MODERATOR.id],
                delete: false,
                lock: true,
                warns: 4,
            },
        },
    },
    roles: {
        label: 'Roles',
        commands: {
            manageRole: {
                file: '../commands/roles/manage-role.js',
                label: 'Manage Role',
                description: 'Add or remove a role from a user.',
                aliases: ['role', 'mr'],
                usage: ['role add @user @role', 'role remove @user @role'],
                permissions: [ROLES.ADMIN.id, ROLES.MODERATOR.id],
                delete: true, // Should always be true to prevent role/user pings
                lock: true,
            },
            manageTier: {
                file: '../commands/roles/manage-tier.js',
                label: 'Manage Tier',
                description: 'Raise or lower a user\'s role level.',
                aliases: ['tier', 'mt'],
                usage: ['tier up @user', 'tier down @user'],
                permissions: [ROLES.ADMIN.id, ROLES.MODERATOR.id],
                delete: true, // Should always be true to prevent role/user pings
                lock: true,
            },
            toggleDuelistRole: {
                file: '../commands/roles/toggle-duelist-role.js',
                label: 'Toggle Duelist Role',
                description: 'Toggles the duelist role for a user.',
                aliases: ['1v1', 'duel', 'duelistrole'],
                usage: ['1v1'],
                permissions: [],
                delete: false,
                lock: true,
            },
            toggleNotificationsRole: {
                file: '../commands/roles/toggle-notifications-role.js',
                label: 'Toggle Notifications Role',
                description: 'Toggles the notifications role for a user.',
                aliases: ['notif', 'notifications', 'ping'],
                usage: ['notifications'],
                permissions: [],
                delete: false,
                lock: true,
            },
        },
    },
    utility: {
        label: 'Utility',
        commands: {
            clearMessages: {
                file: '../commands/utility/clear-messages.js',
                label: 'Clear Messages',
                description: 'Clears recent messages (under 14 days).',
                aliases: ['clear', 'clean', 'delete'],
                usage: ['clear <amount>'],
                permissions: [ROLES.ADMIN.id, ROLES.MODERATOR.id],
                delete: true, // To ensure the command works correctly, keep the value set to true
                lock: false,
            },
            postMessage: {
                file: '../commands/utility/post-message.js',
                label: 'Post Message',
                description: 'Posts a message to the specified channel.',
                aliases: ['post'],
                usage: ['post #channel <text>'],
                permissions: [ROLES.ADMIN.id],
                delete: true,
                lock: false,
            },
        },
    },
};

export default COMMANDS;
