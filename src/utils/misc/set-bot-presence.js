import { PRESENCES } from '../../config/index.js';

export function setBotPresence(client, key) {
    const entry = PRESENCES[key];
    if (!entry) throw new Error(`Unknown presence key: ${key}`);

    const activities = entry.activity ? [{ name: entry.activity.name, type: entry.activity.type }] : [];

    client.user.setPresence({ status: entry.status, activities });
}
