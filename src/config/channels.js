/**
 * @typedef {Object} Channel
 * @property {'CATEGORY' | 'TEXT' | 'VOICE'} type - Channel type
 * @property {string} id - Discord Channel ID
 * @property {string} label - Display name of the channel (matches Discord channel name)
 * @property {string} [description] - Optional description of the channel's purpose
 */

/** @type {Record<string, Channel>} */
const CHANNELS = {
    ADMIN_CATEGORY: {
        type: 'CATEGORY',
        id: '1369957470293721150',
        label: '🛡️ Admin',
        description: 'Category for administration and staff.',
    },
    ADMIN_TEXT: {
        type: 'TEXT',
        id: '1369656849023893535',
        label: '📜・admin',
    },
    ADMIN_BOT: {
        type: 'TEXT',
        id: '1388835947616931870',
        label: '🤖・bot',
        description: 'Text channel for bot messages, tests and logs.',
    },
    ADMIN_VOICE: {
        type: 'VOICE',
        id: '1369957841745743902',
        label: '🔊・Admin',
    },
    INFO_CATEGORY: {
        type: 'CATEGORY',
        id: '1372166437401268368',
        label: 'ℹ️ Info & Help',
    },
    INFO_ANNOUNCEMENTS: {
        type: 'TEXT',
        id: '1372166730402496553',
        label: '📢・announcements',
        description: 'Channel for server news, announcements, and updates.',
    },
    INFO_HELP: {
        type: 'TEXT',
        id: '1397848281123389500',
        label: '❓・help',
        description: 'Channel where higher-ups post useful content for server members.',
    },
    JUICERS_CATEGORY: {
        type: 'CATEGORY',
        id: '1350258846886527018',
        label: '🍹Juice \'em up',
        description: 'Category for trusted users only.',
    },
    JUICERS_TEXT: {
        type: 'TEXT',
        id: '1388544750004469871',
        label: '📄・comp-stomp',
    },
    JUICERS_VOICE: {
        type: 'VOICE',
        id: '1340351282686333121',
        label: '🔦・Off The Record',
    },
    MAIN_CATEGORY: {
        type: 'CATEGORY',
        id: '1338208487720751258',
        label: '🎯 Comp plays',
        description: 'Category for everyone.',
    },
    MAIN_TEXT: {
        type: 'TEXT',
        id: '1338208487720751260',
        label: '💬・wannabe-comp-players',
    },
    MAIN_VOICE: {
        type: 'VOICE',
        id: '1340350676466925588',
        label: '🔋・Installing DBD',
    },
    MAIN_VOICE_SECONDARY: {
        type: 'VOICE',
        id: '1338208487720751261',
        label: '🪫・Uninstalling DBD',
    },
    MAIN_VOICE_OTHER: {
        type: 'VOICE',
        id: '1400920690403836044',
        label: '🫠・Other',
    },
    TEMPORARY_CATEGORY: {
        type: 'CATEGORY',
        id: '1338969515316215891',
        label: '💤・Non-comp',
        description: 'AFK category, used for commands and moving users.',
    },
    TEMPORARY_VOICE: {
        type: 'VOICE',
        id: '1340350512092024832',
        label: '⌛・AFK',
        description: 'Voice channel for users who are AFK or waiting to be moved.',
    },
};

export default CHANNELS;
