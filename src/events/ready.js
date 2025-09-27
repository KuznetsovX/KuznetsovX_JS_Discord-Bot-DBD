import { CHANNELS } from '../config/index.js';
import log from '../utils/logging/log.js';
import { setBotPresence } from '../utils/misc/set-bot-presence.js';
import { runStartupTasks } from '../utils/startup/startup-tasks.js';

export default async function ready(client) {
    log.info('READY', `🤖 Logged in as ${client.user.tag}`);
    const guild = client.guilds.cache.first();
    if (!guild) return log.error('READY', '❌ Bot is not in any guilds.');

    const channel = client.channels.cache.get(CHANNELS.ADMIN.channels.BOT.id);
    setBotPresence(client, 'starting');

    try {
        await runStartupTasks(client, guild, channel);
        setBotPresence(client, 'default');
        client.isInitialized = true;
    } catch (err) {
        setBotPresence(client, 'default');
        client.isInitialized = false;
        log.error('READY', '❌ Startup failed', err);
    }
}
