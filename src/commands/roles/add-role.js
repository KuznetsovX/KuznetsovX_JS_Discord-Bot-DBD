import { ADMIN_ROLE, ROLE_TIERS } from '../../config/roles.js';
import log from '../../utils/logging/log.js';
import { updateUserInDB } from '../../utils/db/update-user-db.js';
import manageTierRoles from '../../utils/roles/auto-manage-tier-roles.js';

export default {
    run: async (message) => {
        const author = message.member;
        const authorTag = message.author.tag;

        // Ensure the user has the required role to use the command
        if (!author.roles.cache.has(ADMIN_ROLE)) {
            log.action('ADD ROLE', `❌ ${authorTag} tried to use !addrole without permission.`);
            return message.reply('❌ You do not have permission to use this command.');
        }

        // Ensure a user is mentioned
        const mentioned = message.mentions.members.first();
        if (!mentioned) {
            log.action('ADD ROLE', `❌ No user mentioned by ${authorTag}.`);
            return message.reply('❌ Please mention a user to add a role to.');
        }

        // Ensure a role is mentioned
        const mentionedRole = message.mentions.roles.first();
        if (!mentionedRole) {
            log.action('ADD ROLE', `❌ No role mentioned by ${authorTag}.`);
            return message.reply('❌ Please mention a role to add.');
        }

        // Prevent adding a role the user already has
        if (mentioned.roles.cache.has(mentionedRole.id)) {
            log.action('ADD ROLE', `⚠️ ${authorTag} tried to add a role (${mentionedRole.name}) that ${mentioned.user.tag} already has.`);
            return message.reply(`⚠️ ${mentioned} already has the ${mentionedRole.name} role.`);
        }

        // Check role hierarchy: user can’t give roles higher or equal to their highest role
        const authorHighest = author.roles.highest;
        if (mentionedRole.position >= authorHighest.position) {
            log.action('ADD ROLE', `❌ ${authorTag} tried to add a higher/equal role (${mentionedRole.name}).`);
            return message.reply('❌ You cannot assign a role equal to or higher than your highest role.');
        }

        // Also make sure the bot itself can assign the role
        const botMember = message.guild.members.me;
        if (!botMember || mentionedRole.position >= botMember.roles.highest.position) {
            log.action('ADD ROLE', `❌ Bot lacks permission to add role ${mentionedRole.name}.`);
            return message.reply('❌ I don’t have permission to assign that role.');
        }

        // Attempt to add the role
        try {
            await mentioned.roles.add(mentionedRole);
            await message.channel.send(`✅ Added role ${mentionedRole} to ${mentioned}.`);
            log.action('ADD ROLE', `✅ ${mentioned.user.tag} was given role ${mentionedRole.name} by ${authorTag}.`);
            await updateUserInDB(mentioned);

            // If the added role is a tier role, trigger auto-manage-tier-roles
            if (ROLE_TIERS.includes(mentionedRole.id)) {
                await manageTierRoles(mentioned);
            }
        } catch (error) {
            log.error(`❌ Error adding role ${mentionedRole.name} to ${mentioned.user.tag}:`, error);
            await message.reply('❌ Something went wrong while adding the role.');
        }
    }
};
