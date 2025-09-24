import { ActivityType } from 'discord.js';

/**
 * @typedef {Object} PresenceActivity
 * @property {ActivityType} type - Type of activity (Listening, Watching, Custom, etc.)
 * @property {string} name - Name of the activity
 */

/**
 * @typedef {Object} Presence
 * @property {'online' | 'idle' | 'dnd' | 'invisible'} status - Discord status
 * @property {PresenceActivity|null} activity - Activity object or null if none
 */

/** @type {Record<string, Presence>} */
const PRESENCES = {
    default: {
        status: 'online',
        activity: {
            type: ActivityType.Listening,
            name: '!help OR ?help',
        },
    },
    online: {
        status: 'online',
        activity: {
            type: ActivityType.Watching,
            name: 'DBD.exe 24/7',
        },
    },
    starting: {
        status: 'dnd',
        activity: {
            type: ActivityType.Custom,
            name: 'Starting up...',
        },
    },
    idle: {
        status: 'idle',
        activity: {
            type: ActivityType.Custom,
            name: '',
        },
    },
    dnd: {
        status: 'dnd',
        activity: {
            type: ActivityType.Custom,
            name: '',
        },
    },
    offline: {
        status: 'invisible',
        activity: null // ignored
    },
};

export default PRESENCES;
