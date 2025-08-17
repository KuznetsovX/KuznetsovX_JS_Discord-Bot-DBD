import config from '../config/index.js';
import { syncMembersToDB } from '../db/index.js';
import autoAssignDefaultRole from '../utils/roles/auto-assign-default-role.js';
import autoManageTierRoles from '../utils/roles/auto-manage-tier-roles.js';
import restoreRolesFromDatabase from '../utils/roles/auto-restore-roles.js';
import log from '../utils/logging/log.js';

export default async function ready(client) {
    log.action('READY', `🤖 Logged in as ${client.user.tag}`);

    const guild = client.guilds.cache.first();
    if (!guild) {
        console.error('❌ Bot is not in any guilds.');
        return;
    }

    const channel = client.channels.cache.get(config.CHANNELS.ADMIN.BOT);
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

        // Sync all current members into DB
        await syncMembersToDB(guild);

        if (channel) {
            await channel.send(`🔋 All startup tasks have been completed, <@${client.user.id}> is now ready to use.`);
        }
        log.action('READY', '✅ All startup tasks completed successfully.');
    } catch (err) {
        console.error('❌ Error during bot startup:', err);
        log.error('READY', err);

        if (channel) {
            await channel.send(`⚠️ Startup failed with error: \`${err.message}\``);
        }
    }
}
