/**
 * @typedef {Object} Channel
 * @property {'TEXT' | 'VOICE'} type - Channel type
 * @property {string} id - Discord Channel ID
 * @property {string} label - Display name of the channel (matches Discord channel name)
 * @property {string} [description] - Description of the channel's purpose (optional)
 */

/**
 * @typedef {Object} Category
 * @property {string} label - Display name of the category
 * @property {Record<string, Channel>} channels - Channels inside this category
 */

/** @type {Record<string, Category>} */
const CHANNELS = {
    ADMIN: {
        label: '🛡️ Admin',
        channels: {
            TEXT: {
                type: 'TEXT',
                id: '1369656849023893535',
                label: '📜・admin',
            },
            BOT: {
                type: 'TEXT',
                id: '1388835947616931870',
                label: '🤖・bot',
                description: 'Text channel for bot messages, tests and logs.',
            },
            VOICE: {
                type: 'VOICE',
                id: '1369957841745743902',
                label: '🔊・Admin',
            },
        },
    },
    INFO: {
        label: 'ℹ️ Info & Help',
        channels: {
            README: {
                type: 'TEXT',
                id: '1420065975696363653',
                label: '📖・readme',
                description: 'Channel for server rules and convenient access to messages that allow you to enable/disable optional roles.',
            },
            ANNOUNCEMENTS: {
                type: 'TEXT',
                id: '1372166730402496553',
                label: '📢・announcements',
                description: 'Channel for server news, announcements, and updates.',
            },
            HELP: {
                type: 'TEXT',
                id: '1397848281123389500',
                label: '❓・help',
                description: 'Channel where higher-ups post useful content for server members.',
            },
        },
    },
    JUICERS: {
        label: '🍹Juice \'em up',
        channels: {
            TEXT: {
                type: 'TEXT',
                id: '1388544750004469871',
                label: '📄・comp-stomp',
            },
            VOICE: {
                type: 'VOICE',
                id: '1340351282686333121',
                label: '🔦・Off The Record',
            },
        },
    },
    MAIN: {
        label: '🎯 Comp plays',
        channels: {
            TEXT: {
                type: 'TEXT',
                id: '1338208487720751260',
                label: '💬・wannabe-comp-players',
            },
            CINEMA: {
                type: 'TEXT',
                id: '1427269706921938986',
                label: '🎥・absolute-cinema',
                description: 'Channel for clips and videos of any sorts.'
            },
            BOT: {
                type: 'TEXT',
                id: '1427280787492962354',
                label: '🦾・beef-with-bot',
                description: 'Channel for bot commands and interactions.',
            },
            VOICE: {
                type: 'VOICE',
                id: '1340350676466925588',
                label: '🔋・Installing DBD',
            },
            VOICE_SECONDARY: {
                type: 'VOICE',
                id: '1338208487720751261',
                label: '🪫・Uninstalling DBD',
            },
            VOICE_OTHER: {
                type: 'VOICE',
                id: '1400920690403836044',
                label: '🫠・Other',
            },
        },
    },
    TEMPORARY: {
        label: '💤・Non-comp',
        channels: {
            VOICE: {
                type: 'VOICE',
                id: '1340350512092024832',
                label: '⌛・AFK',
                description: 'Voice channel for users who are AFK or waiting to be moved.',
            },
        },
    },
};

export default CHANNELS;
