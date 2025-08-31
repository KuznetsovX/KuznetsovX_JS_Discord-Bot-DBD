// src/db/utils/sync-members.js
import { User } from '../connection/index.js';
import log from '../../utils/logging/log.js';

/**
 * Updates a single user's roles and username in the database
 * @param {GuildMember} member - The Discord guild member
 */
export async function syncUserToDB(member) {
    if (!member || !member.user) return;

    const roleNames = member.roles.cache
        .filter(role => role.name !== '@everyone')
        .map(role => role.name);

    try {
        await User.upsert({
            userId: member.id,
            username: member.user.tag,
            roles: roleNames.length ? roleNames.join(', ') : 'No roles', // fallback
        });
        log.action('SYNC USER TO DB', `🔄 Synced DB for ${member.user.tag}`);
    } catch (error) {
        log.error('SYNC USER TO DB', `❌ Failed to sync DB for ${member.user.tag}: ${error.message}`, error);
    }
}


/**
 * Sync all members of a guild into the database
 * @param {Guild} guild - The Discord guild
 */
export async function syncMembersToDB(guild) {
    if (!guild) return;

    const members = guild.members.cache.filter(m => !m.user.bot);
    for (const member of members.values()) {
        await syncUserToDB(member);
    }

    log.action('SYNC MEMBERS TO DB', `✅ Synced ${members.size} members to the database`);
}
