/**
 * Roles configuration
 * 
 * Essential:
 * id           - Discord Role ID
 * position     - Role position in the server hierarchy
 * label        - Display name of the role (matches Discord role name)
 * description  - Explanation of what this role means or is used for
 * color        - Hex color code of the role (for UI/embeds)
 * emoji        - Emoji/icon representing the role
 * users        - Number of users that currently have this role
 *
 * Optional:
 * tier         - Tier level (only for tiered roles; higher = stronger)
 */

const ROLES = {
    ADMIN: {
        id: '1338215159289610330',
        position: 1,
        label: 'For The People user',
        description: 'Server administrator with full access.',
        color: '#a020f0',
        emoji: '⚕️',
        users: 0,
    },
    BOT: {
        id: '1369311261413867573',
        position: 2,
        label: 'DBD.exe',
        description: 'Automated bot account.',
        color: '#a020f0',
        emoji: '🐦‍⬛',
        users: 0,
    },
    MODERATOR: {
        id: '1405236224901517332',
        position: 3,
        label: 'U-ban Evader',
        description: 'Moderators responsible for keeping order.',
        color: '#e97400',
        emoji: '⚠️',
        users: 0,
    },
    MUTED: {
        id: '1373260386979283004',
        position: 4,
        label: 'Muted',
        description: 'Users temporarily restricted from chatting.',
        color: '#505050',
        emoji: '🔇',
        users: 0,
    },
    TRUSTED: {
        id: '1343215068254568458',
        position: 5,
        label: 'Fast vaulting from any angle',
        description: 'Trusted members of the community.',
        color: '#aa006e',
        emoji: '🔥',
        users: 0,
        tier: 3,
    },
    VERIFIED: {
        id: '1338216499445371062',
        position: 6,
        label: 'Do yens pls',
        description: 'Verified community members.',
        color: '#ffbb00',
        emoji: '⚡',
        users: 0,
        tier: 2,
    },
    DUELIST: {
        id: '1368236287865262172',
        position: 7,
        label: '1v1 ME, BOT?!',
        description: 'Users who participate in duels.',
        color: '#ffffff',
        emoji: '⚔️',
        users: 0,
    },
    SPY: {
        id: '1338970627750760568',
        position: 8,
        label: 'Foreign Spy',
        description: 'Default role assigned to new users.',
        color: '#757575',
        emoji: '🥷',
        users: 0,
        tier: 1,
    }
};

export default ROLES;