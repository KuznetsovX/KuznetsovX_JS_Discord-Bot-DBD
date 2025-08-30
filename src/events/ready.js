import { CHANNELS, PREFIXES } from '../config/index.js';
import { syncMembersToDB } from '../db/index.js';
import autoAssignDefaultRole from '../utils/roles/auto-assign-default-role.js';
import autoManageTierRoles from '../utils/roles/auto-manage-tier-roles.js';
import restoreRolesFromDatabase from '../utils/roles/auto-restore-roles.js';
import log from '../utils/logging/log.js';
import { initMetaTable, shouldSyncDB, updateLastSync } from '../db/sqlite-meta.js';

export default async function ready(client) {
    // Initialize meta table for tracking timestamps
    await initMetaTable();

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
        // Restore roles from the database before assigning default roles
        await restoreRolesFromDatabase(guild);

        // Assign default role to all users without a tier role
        await autoAssignDefaultRole(guild);

        // Manage tier roles after the default role assignment
        for (const member of guild.members.cache.values()) {
            if (!member.user.bot) {
                await autoManageTierRoles(member);
            }
        }

        // Sync all current members into DB only if 24h passed since last sync
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

    const helpActivity = PREFIXES.map(p => `${p}help`).join(' OR ');
    client.user.setActivity(helpActivity, { type: 2 });
}
