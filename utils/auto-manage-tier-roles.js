import { ROLE_TIERS } from '../config/roles.js';
import log from './log.js';
import { updateUserInDB } from '../utils/update-user-db.js';

/**
 * Function to remove lower-tier roles and keep only the highest one for each member
 * @param {import('discord.js').GuildMember} member - The member whose roles are to be checked
 */
export default async function manageTierRoles(member) {
    try {
        // Get the member's roles that are part of the tierable roles
        const memberRoles = member.roles.cache.filter(role => ROLE_TIERS.includes(role.id));

        // If member has more than one tier role, remove the lower ones
        if (memberRoles.size > 1) {
            // Sort roles in descending order, so the highest tier role comes first
            const sortedRoles = memberRoles.sort((a, b) => ROLE_TIERS.indexOf(b.id) - ROLE_TIERS.indexOf(a.id));

            // Keep the highest role (first in the sorted array)
            const highestRole = sortedRoles.first();
            const rolesToRemove = sortedRoles.filter(role => role.id !== highestRole.id);

            // Remove lower-tier roles
            await member.roles.remove(rolesToRemove);
            log.action('AUTO MANAGE TIER ROLES', `Removed lower-tier roles from ${member.user.tag}, keeping only ${highestRole.name}.`);
            await updateUserInDB(member);
        }
    } catch (error) {
        log.error('AUTO MANAGE TIER ROLES', `Failed to manage tier roles for ${member.user.tag}: ${error}`);
    }
}
