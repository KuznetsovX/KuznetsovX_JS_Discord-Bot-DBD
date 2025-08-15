import { SPY_ROLE, ROLE_TIERS, ADMIN_ROLE } from '../../config/roles.js';
import { updateUserInDB } from '../../db/utils/update-user-db.js';
import log from '../logging/log.js';

/**
 * Assigns the "Foreign Spy" role to members who do not have a tier role.
 * @param {import('discord.js').Guild} guild
 */
export default async function assignDefaultRole(guild) {
    // Fetch the "Foreign Spy" role
    const spyRole = guild.roles.cache.get(SPY_ROLE);
    if (!spyRole) {
        log.error('AUTO ASSIGN DEFAULT ROLE', `"Foreign Spy" role not found.`);
        return;
    }

    // Fetch all members
    await guild.members.fetch();

    guild.members.cache.forEach(member => {
        // Skip bots and admins
        if (member.user.bot || member.roles.cache.has(ADMIN_ROLE)) return;

        // Check if the member has a tier role
        const hasTierRole = ROLE_TIERS.some(roleId => member.roles.cache.has(roleId));

        // If no tier role, assign the "Foreign Spy" role
        if (!hasTierRole) {
            member.roles.add(spyRole)
                .then(async () => {
                    log.action('AUTO ASSIGN DEFAULT ROLE', `Auto-assigned "Foreign Spy" to ${member.user.tag}.`);
                    await updateUserInDB(member);
                })
                .catch(error => {
                    log.error('AUTO ASSIGN DEFAULT ROLE', `Failed to assign "Foreign Spy" to ${member.user.tag}: ${error}`);
                });
        }
    });
}
