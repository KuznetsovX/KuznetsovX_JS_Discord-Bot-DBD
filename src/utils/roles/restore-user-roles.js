import { getUserRoles } from '../../db/index.js';
import { ROLES } from '../../config/roles.js';
import { updateUserInDB } from '../../db/utils/update-user-db.js';
import log from '../logging/log.js';

/**
 * Restores a user's roles from the database
 * @param {GuildMember} member - The Discord guild member
 * @returns {Promise<boolean>}
 */
export async function restoreUserRoles(member) {
    const storedRoleIDs = await getUserRoles(member.id);
    if (!storedRoleIDs.length) return false;

    const guildRoles = member.guild.roles.cache;
    const botMember = await member.guild.members.fetchMe();
    const botHighestRole = botMember.roles.highest;

    const filteredRoles = storedRoleIDs.filter(roleID => {
        const role = guildRoles.get(roleID);
        if (!role) return false;

        // Skip restricted roles
        if (roleID === ROLES.ADMIN || roleID === ROLES.BOT) return false;

        // Skip roles higher or equal to the bot’s highest role
        if (role.position >= botHighestRole.position) return false;

        return true;
    });

    if (!filteredRoles.length) return false;

    try {
        await member.roles.add(filteredRoles);
        log.action('ROLE RESTORE', `✅ Restored roles for ${member.user.tag}: ${filteredRoles.join(', ')}`);
        await updateUserInDB(member);
        return true;
    } catch (err) {
        log.error(`❌ Failed to restore roles for ${member.user.tag}:`, err);
        return false;
    }
}
