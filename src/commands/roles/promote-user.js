import config from '../../config/index.js';
import { syncUserToDB } from '../../db/utils/sync-user-to-db.js';

export default {
    run: async (message) => {
        try {
            const mentioned = message.mentions.members.first();
            if (!mentioned) {
                return message._send(`❌ Please mention a user to promote.`);
            }

            const currentRoles = mentioned.roles.cache;
            const currentTierIndex = config.ROLE_TIERS.findIndex(roleId => currentRoles.has(roleId));

            if (currentTierIndex === -1) {
                return message._send(`⚠️ User has no tier role to promote.`);
            }

            if (currentTierIndex === config.ROLE_TIERS.length - 1) {
                return message._send(`⚠️ User is already at the highest tier.`);
            }

            const newRoleId = config.ROLE_TIERS[currentTierIndex + 1];
            const oldRoleId = config.ROLE_TIERS[currentTierIndex];

            await mentioned.roles.remove(oldRoleId);
            await mentioned.roles.add(newRoleId);
            await syncUserToDB(mentioned);

            return message._send(`🔼 User was successfully promoted.`);
        } catch (error) {
            throw new Error(`Failed to promote ${message.mentions.members.first()?.user.tag || 'unknown'}: ${error.message}`);
        }
    }
};
