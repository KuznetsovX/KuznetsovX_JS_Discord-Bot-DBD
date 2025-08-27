import { ROLES } from '../../config/index.js';
import log from '../logging/log.js';
import { syncUserToDB } from '../../db/utils/sync-user-to-db.js';

/**
 * Function to remove lower-tier roles and keep only the highest one for each member
 * @param {import('discord.js').GuildMember} member - The member whose roles are to be checked
 */
export default async function manageTierRoles(member) {
    try {
        // Get all tier roles IDs
        const tierRoles = Object.values(ROLES).filter(r => r.tier);
        const tierRoleIds = tierRoles.map(r => r.id);

        // Get the member's roles that are part of the tier roles
        const memberTierRoles = member.roles.cache.filter(role => tierRoleIds.includes(role.id));

        // If member has more than one tier role, remove the lower ones
        if (memberTierRoles.size > 1) {
            // Sort roles in descending order by tier (highest first)
            const sortedRoles = memberTierRoles.sort((a, b) => {
                const tierA = tierRoles.find(r => r.id === a.id).tier;
                const tierB = tierRoles.find(r => r.id === b.id).tier;
                return tierB - tierA;
            });

            // Keep the highest role (first in the sorted collection)
            const highestRole = sortedRoles.first();
            const rolesToRemove = sortedRoles.filter(role => role.id !== highestRole.id);

            // Remove lower-tier roles
            await member.roles.remove(rolesToRemove);
            log.action('AUTO MANAGE TIER ROLES', `✅ Removed lower-tier roles from ${member.user.tag}, keeping only ${highestRole.name}.`);
            await syncUserToDB(member);
        }
    } catch (error) {
        log.error('AUTO MANAGE TIER ROLES', `❌ Failed to manage tier roles for ${member.user.tag}: ${error}`);
    }
}
