import { ROLES } from '../../config/index.js';
import { saveRoles } from '../../utils/roles/role-manager.js';

const ACTION_ALIASES = {
    up: ['up', 'promote', '+'],
    down: ['down', 'demote', '-'],
};

function normalizeAction(action) {
    for (const [key, aliases] of Object.entries(ACTION_ALIASES)) {
        if (aliases.includes(action)) return key;
    }
    return null;
}

export default {
    run: async (message) => {
        try {
            const args = message.content.trim().split(/\s+/);
            const rawAction = args[1]?.toLowerCase();
            const action = normalizeAction(rawAction);

            if (!action) {
                return message._send(`❌ Usage: \`!tier up @user\` (\`+\`, \`promote\`) or \`!tier down @user\` (\`-\`, \`demote\`)`);
            }

            const mentioned = message.mentions.members.first();
            if (!mentioned) return message._send(`❌ Please mention a user.`);

            const tierRoles = Object.values(ROLES).filter(r => r.tier);
            const userTierRole = tierRoles.find(r => mentioned.roles.cache.has(r.id));

            if (!userTierRole) return message._send(`⚠️ User has no tier role to modify.`);

            let newTier;
            if (action === 'up') newTier = userTierRole.tier + 1;
            if (action === 'down') newTier = userTierRole.tier - 1;

            const newRole = tierRoles.find(r => r.tier === newTier);
            if (!newRole) {
                const atBoundary = action === 'up' ? 'highest' : 'lowest';
                return message._send(`⚠️ User is already at the ${atBoundary} tier role.`);
            }

            await mentioned.roles.remove(userTierRole.id);
            await mentioned.roles.add(newRole.id);

            await saveRoles(mentioned);

            const arrow = action === 'up' ? '🔼' : '🔽';
            const verb = action === 'up' ? 'raised' : 'lowered';
            return message._send(`${arrow} User\'s tier role was successfully ${verb}.`);
        } catch (error) {
            throw new Error(
                `Failed to modify tier for ${message.mentions.members.first()?.user.tag || 'unknown'}: ${error.message}`
            );
        }
    }
};
