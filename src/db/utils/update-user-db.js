import { User } from '../user-model.js';
import log from '../../utils/logging/log.js';

/**
 * Updates a single user's roles and username in the database
 * @param {GuildMember} member - The Discord guild member
 */
export async function updateUserInDB(member) {
    if (!member || !member.user) return;

    const rolesString = member.roles.cache
        .filter(role => role.name !== '@everyone')
        .map(role => `${role.name} (${role.id})`)
        .join(', ');

    try {
        await User.upsert({
            userId: member.id,
            username: member.user.tag,
            roles: rolesString,
        });
        log.action(`UPDATE USER DB`, `🔄 Synced DB for ${member.user.tag}`);
    } catch (error) {
        log.error(`UPDATE USER DB`, `❌ Failed to update DB for ${member.user.tag}: ${error.message}`, error);
    }
}
