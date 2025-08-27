/**
 * Roles configuration
 * 
 * Essential:
 * position     - Role position in the server hierarchy
 * id           - Discord Role ID
 * emoji        - Emoji/icon representing the role
 * label        - Display name of the role (matches Discord role name)
 * description  - Explanation of what this role means or is used for
 * color        - Hex color code of the role (for UI/embeds)
 * users        - Number of users that currently have this role
 *
 * Optional:
 * tier         - Tier level (only for tiered roles; higher = stronger)
 */

const ROLES = {
    ADMIN: {
        position: 1,
        id: '1338215159289610330',
        emoji: '⚕️',
        label: 'For The People user',
        description: 'Server administrator with full access.',
        color: '#a020f0',
        users: 0,
    },
    BOT: {
        position: 2,
        id: '1369311261413867573',
        emoji: '🐦‍⬛',
        label: 'DBD.exe',
        description: 'Automated bot account.',
        color: '#a020f0',
        users: 0,
    },
    MODERATOR: {
        position: 3,
        id: '1405236224901517332',
        emoji: '⚠️',
        label: 'U-ban Evader',
        description: 'Moderators responsible for keeping order.',
        color: '#e97400',
        users: 0,
    },
    MUTED: {
        position: 4,
        id: '1373260386979283004',
        emoji: '🔇',
        label: 'Muted',
        description: 'Users temporarily restricted from chatting.',
        color: '#505050',
        users: 0,
    },
    TRUSTED: {
        position: 5,
        id: '1343215068254568458',
        emoji: '🔥',
        label: 'Fast vaulting from any angle',
        description: 'Trusted members of the community.',
        color: '#aa006e',
        users: 0,
        tier: 3,
    },
    VERIFIED: {
        position: 6,
        id: '1338216499445371062',
        emoji: '⚡',
        label: 'Do yens pls',
        description: 'Verified community members.',
        color: '#ffbb00',
        users: 0,
        tier: 2,
    },
    DUELIST: {
        position: 7,
        id: '1368236287865262172',
        emoji: '⚔️',
        label: '1v1 ME, BOT?!',
        description: 'Users who participate in duels.',
        color: '#ffffff',
        users: 0,
    },
    SPY: {
        position: 8,
        id: '1338970627750760568',
        emoji: '🥷',
        label: 'Foreign Spy',
        description: 'Default role assigned to new users.',
        color: '#757575',
        users: 0,
        tier: 1,
    }
};

export default ROLES;