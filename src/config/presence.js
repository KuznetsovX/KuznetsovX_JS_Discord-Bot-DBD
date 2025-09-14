import { ActivityType } from 'discord.js';

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
