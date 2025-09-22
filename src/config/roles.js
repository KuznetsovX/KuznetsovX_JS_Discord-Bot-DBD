/**
 * @typedef {Object} Role
 * @property {number} position - Role position in the server hierarchy
 * @property {string} id - Discord Role ID
 * @property {string} label - Display name of the role (matches Discord role name)
 * @property {string} description - Explanation of what this role means or is used for
 * @property {string} color - Hex color code of the role (for UI/embeds)
 * @property {number} [tier] - Tier level (only for tiered roles; higher = stronger)
 */

/** @type {Record<string, Role>} */
const ROLES = {
    ADMIN: {
        position: 1,
        id: '1338215159289610330',
        label: '⚕️ For The People user ⚕️',
        description: 'Server administrator with full access.',
        color: '#a020f0',
    },
    BOT: {
        position: 2,
        id: '1369311261413867573',
        label: '🐦‍⬛ DBD.exe 🐦‍⬛',
        description: 'Automated bot account.',
        color: '#a020f0',
    },
    MODERATOR: {
        position: 3,
        id: '1405236224901517332',
        label: '⚠️ U-ban Evader ⚠️',
        description: 'Moderators responsible for keeping order.',
        color: '#e97400',
    },
    MUTED: {
        position: 4,
        id: '1373260386979283004',
        label: '🔇 Muted 🔇',
        description: 'Users temporarily restricted from chatting.',
        color: '#505050',
    },
    TRUSTED: {
        position: 5,
        id: '1343215068254568458',
        label: '🔥 Fast vaulting from any angle 🔥',
        description: 'Trusted members of the community.',
        color: '#aa006e',
        tier: 3,
    },
    VERIFIED: {
        position: 6,
        id: '1338216499445371062',
        label: '⚡ Do yens pls ⚡',
        description: 'Verified community members.',
        color: '#ffbb00',
        tier: 2,
    },
    DUELIST: {
        position: 7,
        id: '1368236287865262172',
        label: '⚔️ 1v1 ME, BOT?! ⚔️',
        description: 'Users who want to participate in 1v1 games.',
        color: '#ffffff',
    },
    SPY: {
        position: 8,
        id: '1338970627750760568',
        label: '🥷 Foreign Spy 🥷',
        description: 'Default role assigned to new users.',
        color: '#757575',
        tier: 1,
    },
    NOTIFICATIONS: {
        position: 9,
        id: '1419704455430934529',
        label: '🔔 Notifications 🔔',
        description: 'Users who want to receive notifications about games, updates, guides, etc.',
        color: '#f1c40f',
    }
};

export default ROLES;
