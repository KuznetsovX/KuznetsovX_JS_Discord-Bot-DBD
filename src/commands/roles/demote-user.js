import config from '../../config/index.js';
import { syncUserToDB } from '../../db/utils/sync-user-to-db.js';

export default {
    run: async (message) => {
        const author = message.member;

        const mentioned = message.mentions.members.first();
        if (!mentioned) {
            return message.channel.send(`❌ ${author}, please mention a user to demote.`);
        }

        const currentRoles = mentioned.roles.cache;
        const currentTierIndex = config.ROLE_TIERS.findIndex(roleId => currentRoles.has(roleId));

        if (currentTierIndex === -1) {
            return message.channel.send(`⚠️ ${author}, this user has no tier role to demote.`);
        }

        if (currentTierIndex === 0) {
            return message.channel.send(`⚠️ ${author}, this user is already at the lowest tier role.`);
        }

        const newRoleId = config.ROLE_TIERS[currentTierIndex - 1];
        const oldRoleId = config.ROLE_TIERS[currentTierIndex];

        try {
            await mentioned.roles.remove(oldRoleId);
            await mentioned.roles.add(newRoleId);
            await syncUserToDB(mentioned);

            await message.channel.send(`🔽 ${author}, user was successfully demoted.`);
        } catch (error) {
            throw new Error(`Failed to demote ${mentioned.user.tag}: ${error.message}`);
        }
    }
};
