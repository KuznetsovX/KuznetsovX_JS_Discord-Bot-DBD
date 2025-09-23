import { Op } from 'sequelize';
import { User } from '../connection/index.js';
import log from '../../utils/logging/log.js';

/**
 * Removes a single user from the database
 * @param {GuildMember|String|Object} memberOrId - The Discord guild member, their ID, or an object with `id` and optional `tag`
 */
export async function removeUserFromDB(memberOrId) {
    if (!memberOrId) return;

    let userId;
    let tag = 'Unknown';

    if (typeof memberOrId === 'string') {
        userId = memberOrId;
    } else if (memberOrId.user) {
        userId = memberOrId.id;
        tag = memberOrId.user.tag;
    } else if (memberOrId.id) {
        userId = memberOrId.id;
        tag = memberOrId.tag || 'Unknown';
    } else {
        return;
    }

    try {
        const deleted = await User.destroy({ where: { userId } });

        if (deleted) {
            log.action_db('REMOVE USER FROM DB', `🗑️ Removed ${tag} (Discord ID: ${userId}) from the database`);
        } else {
            log.warn('REMOVE USER FROM DB', `User ${tag} (Discord ID: ${userId}) not found in database`);
        }
    } catch (error) {
        log.error('REMOVE USER FROM DB', `❌ Failed to remove ${tag} (Discord ID: ${userId}): ${error.message}`, error);
    }
}

/**
 * Removes all users from the database for a given guild
 * @param {Guild} guild - The Discord guild
 */
export async function removeMembersFromDB(guild) {
    if (!guild) return;

    const members = guild.members.cache.filter(m => !m.user.bot);
    const memberIds = members.map(m => m.id);

    if (memberIds.length === 0) return;

    try {
        const deleted = await User.destroy({
            where: { userId: { [Op.in]: memberIds } }
        });
        log.action_db('REMOVE ALL USERS FROM DB', `🗑️ Removed ${deleted} members from the database`);
    } catch (error) {
        log.error('REMOVE ALL USERS FROM DB', `❌ Failed to remove members: ${error.message}`, error);
    }
}
