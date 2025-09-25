import ROLE_CATEGORIES from './role-categories.js';

/**
 * @typedef {Object} Role
 * @property {number} position - Role position in the server hierarchy
 * @property {string} id - Discord Role ID
 * @property {string} label - Display name of the role (matches Discord role name)
 * @property {string} description - Explanation of what this role means or is used for
 * @property {string} color - Hex color code of the role (for UI/embeds)
 * @property {number} [tier] - Tier level (only for tiered roles; higher = stronger)
 * @property {string} [category] - Logical category of the role
 */

/** @type {Record<string, Role>} */
const ROLES = {
    // ------------------------------
    // Staff & Bot Accounts
    // Full-access admins, moderators, and automated bots
    // ------------------------------
    ADMIN: {
        position: 1,
        id: '1338215159289610330',
        label: '⚕️ For The People user ⚕️',
        description: 'Server administrator. Has full access.',
        color: '#7517c1',
        category: ROLE_CATEGORIES.STAFF,
    },
    BOT: {
        position: 2,
        id: '1369311261413867573',
        label: '🐦‍⬛ DBD.exe 🐦‍⬛',
        description: 'Automated bot account. Can do whatever it\'s designed to do. Sometimes more.',
        color: '#a020f0',
        category: ROLE_CATEGORIES.STAFF,
    },
    MODERATOR: {
        position: 3,
        id: '1405236224901517332',
        label: '⚠️ U-ban Evader ⚠️',
        description: 'Moderator. Responsible for keeping order.',
        color: '#b84df5',
        category: ROLE_CATEGORIES.STAFF,
    },
    // ------------------------------
    // Restricted Users
    // Members with temporary or permanent chat restrictions
    // ------------------------------
    MUTED: {
        position: 4,
        id: '1373260386979283004',
        label: '🔇 Muted 🔇',
        description: 'Users temporarily restricted from chatting.',
        color: '#505050',
        category: ROLE_CATEGORIES.RESTRICTED,
    },
    // ------------------------------
    // Trusted & High-Tier Community Members
    // Active and dependable users with special recognition
    // ------------------------------
    JUICER: {
        position: 5,
        id: '1420022813129179279',
        label: '🕐 7-second chaser 🕐',
        description: 'Ultimate Juicers. Unique users who only have seven seconds to play with you.',
        color: '#6d0046',
        tier: 6,
        category: ROLE_CATEGORIES.TRUSTED,
    },
    BARE_BONES: {
        position: 6,
        id: '1419967443467501659',
        label: '🗿 Running empty loadouts 🗿',
        description: 'Regulars who are solid, dependable, and occasionally go full bare-bones mode.',
        color: '#850059',
        tier: 5,
        category: ROLE_CATEGORIES.TRUSTED,
    },
    TRUSTED: {
        position: 7,
        id: '1343215068254568458',
        label: '🔥 Fast vaulting from any angle 🔥',
        description: 'Trusted members of the community. Can hit any fast vault there is in the game. Only partially true.',
        color: '#aa006e',
        tier: 4,
        category: ROLE_CATEGORIES.TRUSTED,
    },
    // ------------------------------
    // Verified Users
    // Standard community members with verified status
    // ------------------------------
    TOTEM_CLEANER: {
        position: 8,
        id: '1420025122021969920',
        label: '🧹 Cleansing dull totems 🧹',
        description: 'No game will be left with totems in it. Main objective isn\'t escaping.',
        color: '#d4a017',
        tier: 3,
        category: ROLE_CATEGORIES.VERIFIED,
    },
    VERIFIED: {
        position: 9,
        id: '1338216499445371062',
        label: '⚡ Do yens pls ⚡',
        description: 'Verified community members. Not used to doing gens, hence losing easy games.',
        color: '#f1c232',
        tier: 2,
        category: ROLE_CATEGORIES.VERIFIED,
    },
    // ------------------------------
    // Default Role for New Members
    // ------------------------------
    SPY: {
        position: 10,
        id: '1338970627750760568',
        label: '🥷 Foreign Spy 🥷',
        description: 'Default role assigned to new users.',
        color: '#757575',
        tier: 1,
        category: ROLE_CATEGORIES.DEFAULT,
    },
    // ------------------------------
    // Special & Optional Roles
    // Roles for participation in games, notifications, or other extras
    // ------------------------------
    DUELIST: {
        position: 11,
        id: '1368236287865262172',
        label: '⚔️ 1v1 ⚔️',
        description: 'Users who want to participate in 1v1 games.',
        color: '#ffffff',
        category: ROLE_CATEGORIES.SPECIAL,
    },
    NOTIFICATIONS: {
        position: 12,
        id: '1419704455430934529',
        label: '🔔 alerts 🔔',
        description: 'Users who want to receive notifications about games, updates, guides, etc.',
        color: '#ffffff',
        category: ROLE_CATEGORIES.SPECIAL,
    }
};

export default ROLES;
