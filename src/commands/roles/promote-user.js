import { ROLES } from '../../config/index.js';
import { saveRoles } from '../../utils/roles/role-manager.js';

export default {
    run: async (message) => {
        try {
            const mentioned = message.mentions.members.first();
            if (!mentioned) return message._send(`❌ Please mention a user to promote.`);

            const tierRoles = Object.values(ROLES).filter(r => r.tier);
            const userTierRole = tierRoles.find(r => mentioned.roles.cache.has(r.id));

            if (!userTierRole) return message._send(`⚠️ User has no tier role to promote.`);

            const newTier = userTierRole.tier + 1;
            const newRole = tierRoles.find(r => r.tier === newTier);
            if (!newRole) return message._send(`⚠️ User is already at the highest tier.`);

            await mentioned.roles.remove(userTierRole.id);
            await mentioned.roles.add(newRole.id);

            await saveRoles(mentioned);

            return message._send(`🔼 User was successfully promoted.`);
        } catch (error) {
            throw new Error(`Failed to promote ${message.mentions.members.first()?.user.tag || 'unknown'}: ${error.message}`);
        }
    }
};
