import { User } from '../connection/index.js';
import log from '../../utils/logging/log.js';

/**
 * Get role IDs for a specific user from the DB
 * @param {string} userId
 * @returns {Promise<string[]>} Array of role IDs
 */
export async function getUserRoles(userId) {
    try {
        const user = await User.findOne({ where: { userId } });
        if (!user || !user.roleIds) return [];
        return user.roleIds.split(',').map(r => r.trim()).filter(Boolean);
    } catch (error) {
        log.error('DATABASE', `❌ Failed to get roles for userId ${userId}: ${error.message}`, error);
        return [];
    }
}

/**
 * Save role IDs for a specific user
 * @param {string} userId
 * @param {string[]} roleIds
 */
export async function saveUserRoles(userId, roleIds) {
    try {
        await User.upsert({
            userId,
            roleIds: roleIds.join(',')
        });
        log.action_db('DATABASE', `💾 Saved role IDs for userId ${userId}: ${roleIds.join(', ')}`);
    } catch (error) {
        log.error('DATABASE', `❌ Failed to save roles for userId ${userId}: ${error.message}`, error);
    }
}

/**
 * Remove a specific role ID from a user's roles in the DB
 * @param {string} userId
 * @param {string} roleId
 */
export async function removeUserRoles(userId, roleIds) {
    try {
        const currentRoles = await getUserRoles(userId);

        const updatedRoles = currentRoles.filter(r => !roleIds.includes(r));

        if (updatedRoles.length === currentRoles.length) return;

        await saveUserRoles(userId, updatedRoles);
        log.action_db('DATABASE', `🗑️ Removed roles [${roleIds.join(', ')}] from userId ${userId}`);
    } catch (error) {
        log.error('DATABASE', `❌ Failed to remove roles [${roleIds.join(', ')}] for userId ${userId}: ${error.message}`, error);
    }
}
