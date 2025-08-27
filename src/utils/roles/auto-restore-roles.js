import { ROLES } from '../../config/index.js';
import log from '../logging/log.js';
import { getUserRoles } from '../../db/index.js';

/**
 * Restores roles for all members in a guild from the database.
 * @param {import('discord.js').Guild} guild
 */
export default async function restoreRolesFromDatabase(guild) {
    await guild.members.fetch();

    guild.members.cache.forEach(async (member) => {
        // Skip bots and admins
        if (member.user.bot || member.roles.cache.has(ROLES.ADMIN.id)) return;

        // Count roles excluding @everyone
        const userRoles = member.roles.cache.filter(role => role.id !== guild.id);

        if (userRoles.size === 0) {
            try {
                const storedRoles = await getUserRoles(member.id);

                if (storedRoles.length > 0) {
                    // Filter stored roles to those still existing in the guild
                    const validRoles = storedRoles.filter(roleId => guild.roles.cache.has(roleId));

                    if (validRoles.length === 0) {
                        log.warn('AUTO RESTORE ROLES', `⚠️ Stored roles for ${member.user.tag} do not exist anymore.`);
                        return;
                    }

                    await member.roles.add(validRoles);
                    log.action('AUTO RESTORE ROLES', `✅ Restored roles for ${member.user.tag}: [${validRoles.join(', ')}]`);
                } else {
                    log.warn('AUTO RESTORE ROLES', `⚠️ No stored roles found for ${member.user.tag}.`);
                }
            } catch (err) {
                log.error('AUTO RESTORE ROLES', `❌ Failed restoring roles for ${member.user.tag}: ${err}`);
            }
        }
    });
}
