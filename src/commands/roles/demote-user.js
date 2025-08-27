import { ROLES } from '../../config/index.js';
import { syncUserToDB } from '../../db/utils/sync-user-to-db.js';

export default {
    run: async (message) => {
        try {
            const mentioned = message.mentions.members.first();
            if (!mentioned) {
                return message._send(`❌ Please mention a user to demote.`);
            }

            const tierRoles = Object.values(ROLES).filter(r => r.tier);
            const userTierRole = tierRoles.find(r => mentioned.roles.cache.has(r.id));

            if (!userTierRole) {
                return message._send(`⚠️ User has no tier role to demote.`);
            }

            const newTier = userTierRole.tier - 1;
            if (newTier < Math.min(...tierRoles.map(r => r.tier))) {
                return message._send(`⚠️ User is already at the lowest tier role.`);
            }

            const newRole = tierRoles.find(r => r.tier === newTier);
            if (!newRole) {
                return message._send(`❌ Could not find a role for tier ${newTier}.`);
            }

            await mentioned.roles.remove(userTierRole.id);
            await mentioned.roles.add(newRole.id);
            await syncUserToDB(mentioned);

            return message._send(`🔽 User was successfully demoted from ${userTierRole.label} to ${newRole.label}.`);
        } catch (error) {
            throw new Error(`Failed to demote ${message.mentions.members.first()?.user.tag || 'unknown'}: ${error.message}`);
        }
    }
};
