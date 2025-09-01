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
        log.action('DATABASE', `💾 Saved role IDs for userId ${userId}: ${roleIds.join(', ')}`);
    } catch (error) {
        log.error('DATABASE', `❌ Failed to save roles for userId ${userId}: ${error.message}`, error);
    }
}
