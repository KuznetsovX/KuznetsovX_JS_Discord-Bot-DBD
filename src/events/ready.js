import { CHANNELS, PREFIXES } from '../config/index.js';
import { syncMembersToDB, shouldSyncDB, updateLastSync } from '../db/index.js';
import { assignDefaultRole, manageTierRoles, restoreRoles } from '../utils/roles/role-manager.js';
import log from '../utils/logging/log.js';

export default async function ready(client) {
    log.info('READY', `🤖 Logged in as ${client.user.tag}`);

    const guild = client.guilds.cache.first();
    if (!guild) {
        log.error('READY', '❌ Bot is not in any guilds.');
        return;
    }

    const channel = client.channels.cache.get(CHANNELS.ADMIN_BOT.id);
    if (channel) {
        await channel.send('🪫 Starting up... please wait until all startup tasks are completed.');
    }

    try {
        await guild.members.fetch();

        await restoreRoles(guild);
        await assignDefaultRole(guild);
        await manageTierRoles(guild);

        if (await shouldSyncDB()) {
            await syncMembersToDB(guild);
            await updateLastSync();
            log.action('READY', '✅ Members synced to DB (24h interval check).');
        } else {
            log.info('READY', '⏩ DB sync skipped (less than 24h since last sync).');
        }

        if (channel) {
            await channel.send(`🔋 All startup tasks have been completed, <@${client.user.id}> is now ready to use.`);
        }
        log.info('READY', '✅ All startup tasks completed successfully.');
    } catch (err) {
        log.error('READY', '❌ Error during bot startup', err);

        if (channel) {
            await channel.send(`⚠️ Startup failed with error: \`${err.message}\``);
        }
    }

    client.user.setActivity(PREFIXES.map(p => `${p}help`).join(' OR '), { type: 2 });
}
