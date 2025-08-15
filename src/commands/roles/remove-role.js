import { ADMIN_ROLE, ROLE_TIERS } from '../../config/roles.js';
import log from '../../utils/logging/log.js';
import { updateUserInDB } from '../../db/utils/update-user-db.js';
import autoAssignDefaultRole from '../../utils/roles/auto-assign-default-role.js';

export default {
    run: async (message) => {
        const author = message.member;
        const authorTag = message.author.tag;

        // Ensure the user has the required role to use the command
        if (!author.roles.cache.has(ADMIN_ROLE)) {
            log.action('REMOVE ROLE', `❌ ${authorTag} tried to use !removerole without permission.`);
            return message.reply('❌ You do not have permission to use this command.');
        }

        // Ensure a user is mentioned
        const mentioned = message.mentions.members.first();
        if (!mentioned) {
            log.action('REMOVE ROLE', `❌ No user mentioned by ${authorTag}.`);
            return message.reply('❌ Please mention a user to remove a role from.');
        }

        // Ensure a role is mentioned
        const mentionedRole = message.mentions.roles.first();
        if (!mentionedRole) {
            log.action('REMOVE ROLE', `❌ No role mentioned by ${authorTag}.`);
            return message.reply('❌ Please mention a role to remove.');
        }

        // Prevent removing a role the user doesn't have
        if (!mentioned.roles.cache.has(mentionedRole.id)) {
            log.action('REMOVE ROLE', `⚠️ ${authorTag} tried to remove a role (${mentionedRole.name}) that ${mentioned.user.tag} does not have.`);
            return message.reply(`⚠️ ${mentioned} does not have the ${mentionedRole.name} role.`);
        }

        // Check role hierarchy: user can’t remove roles higher or equal to their highest role
        const authorHighest = author.roles.highest;
        if (mentionedRole.position >= authorHighest.position) {
            log.action('REMOVE ROLE', `❌ ${authorTag} tried to remove a higher/equal role (${mentionedRole.name}).`);
            return message.reply('❌ You cannot remove a role equal to or higher than your highest role.');
        }

        // Also make sure the bot itself can remove the role
        const botMember = message.guild.members.me;
        if (!botMember || mentionedRole.position >= botMember.roles.highest.position) {
            log.action('REMOVE ROLE', `❌ Bot lacks permission to remove role ${mentionedRole.name}.`);
            return message.reply('❌ I don’t have permission to remove that role.');
        }

        // Attempt to remove the role
        try {
            await mentioned.roles.remove(mentionedRole);
            await message.channel.send(`✅ Removed role ${mentionedRole} from ${mentioned}.`);
            log.action('REMOVE ROLE', `✅ ${mentioned.user.tag} had role ${mentionedRole.name} removed by ${authorTag}.`);
            await updateUserInDB(mentioned);

            // If the removed role is a tier role and user now has no tier roles, assign the default role
            if (ROLE_TIERS.includes(mentionedRole.id)) {
                const hasTierRole = ROLE_TIERS.some(roleId => mentioned.roles.cache.has(roleId));
                if (!hasTierRole) {
                    await autoAssignDefaultRole(message.guild);
                }
            }
        } catch (error) {
            log.error(`❌ Error removing role ${mentionedRole.name} from ${mentioned.user.tag}:`, error);
            await message.reply('❌ Something went wrong while removing the role.');
        }
    }
};
