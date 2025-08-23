import { User } from '../user-model.js';
import log from '../../utils/logging/log.js';

/**
 * Removes a user from the database
 * @param {GuildMember|String} memberOrId - The Discord guild member or their ID
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
    } else {
        return;
    }

    try {
        const deleted = await User.destroy({
            where: { userId }
        });

        if (deleted) {
            log.action('REMOVE USER FROM DB', `🗑️ Removed ${tag} (ID: ${userId}) from the database`);
        } else {
            log.warn('REMOVE USER FROM DB', `⚠️ User ${tag} (ID: ${userId}) not found in database`);
        }
    } catch (error) {
        log.error('REMOVE USER FROM DB', `❌ Failed to remove ${tag} (ID: ${userId}): ${error.message}`, error);
    }
}
