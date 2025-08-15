import { ADMIN_BOT_CHANNEL } from '../config/channels.js';
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

    const channel = client.channels.cache.get(ADMIN_BOT_CHANNEL);
    if (channel) {
        channel.send('🔥 DBD.exe is now online!');
    }

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
}
