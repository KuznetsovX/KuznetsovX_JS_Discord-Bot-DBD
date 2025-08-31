import log from '../../utils/logging/log.js';
import { User } from '../connection/index.js';

/**
 * Get roles for a specific user from the DB
 * @param {string} userId
 * @returns {Promise<string[]>} Array of role IDs
 */
export async function getUserRoles(userId) {
    try {
        const user = await User.findOne({ where: { userId } });
        if (!user || !user.roles) return [];
        return user.roles.split(',').map(r => r.trim()).filter(Boolean);
    } catch (error) {
        log.error('DATABASE', `❌ Failed to get roles for userId ${userId}: ${error.message}`, error);
        return [];
    }
}

/**
 * Save roles for a specific user
 * @param {string} userId
 * @param {string[]} roleIds
 */
export async function saveUserRoles(userId, roleIds) {
    try {
        await User.upsert({
            userId,
            roles: roleIds.join(',')
        });
        log.action('DATABASE', `💾 Saved roles for userId ${userId}: ${roleIds.join(', ')}`);
    } catch (error) {
        log.error('DATABASE', `❌ Failed to save roles for userId ${userId}: ${error.message}`, error);
    }
}
