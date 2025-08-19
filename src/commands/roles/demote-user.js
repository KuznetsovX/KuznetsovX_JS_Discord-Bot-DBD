import config from '../../config/index.js';
import log from '../../utils/logging/log.js';
import { updateUserInDB } from '../../db/utils/update-user-db.js';

export default {
    run: async (message) => {
        const authorTag = message.author.tag;

        // Ensure a user is mentioned
        const mentioned = message.mentions.members.first();
        if (!mentioned) {
            log.action('DEMOTE USER', `❌ No user mentioned by ${authorTag}.`);
            return message.reply('❌ Please mention a user to demote.');
        }

        const currentRoles = mentioned.roles.cache;
        const currentTierIndex = config.ROLE_TIERS.findIndex(roleId => currentRoles.has(roleId)); // Find the index of the current tier

        // Check if the user has a tier role
        if (currentTierIndex === -1) {
            log.action('DEMOTE USER', `❌ ${authorTag} tried to demote ${mentioned.user.tag}, but they have no tier role.`);
            return message.reply(`❌ ${mentioned} has no tier role to demote.`);
        }

        // Check if the user is already at the lowest tier
        if (currentTierIndex === 0) {
            log.action('DEMOTE USER', `⚠️ ${authorTag} tried to demote ${mentioned.user.tag}, but they are already at the lowest tier.`);
            return message.reply(`⚠️ ${mentioned} is already at the lowest tier.`);
        }

        // Get the new role to assign
        const newRoleId = config.ROLE_TIERS[currentTierIndex - 1];
        const oldRoleId = config.ROLE_TIERS[currentTierIndex];

        // Attempt to remove the current role and add the new role
        try {
            await mentioned.roles.remove(oldRoleId);
            await mentioned.roles.add(newRoleId);

            await message.channel.send(`🔽 Demoted ${mentioned} to tier ${currentTierIndex}.`);
            log.action('DEMOTE USER', `✅ ${mentioned.user.tag} was demoted from tier ${currentTierIndex + 1} to tier ${currentTierIndex} by ${authorTag}.`);
            await updateUserInDB(mentioned);
        } catch (error) {
            log.error(`❌ Error demoting ${mentioned.user.tag}:`, error);
            await message.reply('❌ Something went wrong while demoting the user.');
        }
    }
};
