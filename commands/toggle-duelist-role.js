import { DUEL_ROLE, ADMIN_ROLE } from '../config/roles.js';
import log from '../utils/log.js';
import { updateUserInDB } from '../utils/update-user-db.js';

export default {
    run: async (message) => {
        // Determine the target user (mentioned user or message author)
        const target = message.mentions.members.first() || message.member;
        const targetTag = target.user.tag;
        const authorTag = message.author.tag;

        // Get the "1v1 ME, BOT?" role from the guild
        const role = message.guild.roles.cache.get(DUEL_ROLE);
        if (!role) {
            log.action('TOGGLE DUELIST ROLE', `❌ "1v1 ME, BOT?" role not found.`);
            return message.reply('❌ Could not find the "1v1 ME, BOT?" role.');
        }

        // Admins can assign/remove the duelist role for anyone, as long as one user is mentioned
        if (message.member.roles.cache.has(ADMIN_ROLE) && message.mentions.members.size === 1) {
            await toggleRole(target, message, authorTag, targetTag);
            return;
        }

        // Non-admins can only toggle their own duelist role
        if (target === message.member) {
            await toggleRole(target, message, authorTag, targetTag);
            return;
        }

        // If the user is neither an admin nor toggling their own role, send an error
        message.reply('❌ You can only toggle your own duelist role unless you are an admin.');
    }
};

// Helper function to add or remove the duelist role
async function toggleRole(target, message, authorTag, targetTag) {
    try {
        if (target.roles.cache.has(DUEL_ROLE)) {
            // User already has the role — remove it
            await target.roles.remove(DUEL_ROLE);
            await message.channel.send(`🚫 ${target} is no longer available for duel.`);
            log.action('TOGGLE DUELIST ROLE', `🔄 ${targetTag} had the duelist role removed by ${authorTag}`);
            await updateUserInDB(target);
        } else {
            // User doesn't have the role — add it
            await target.roles.add(DUEL_ROLE);
            await message.channel.send(`⚔️ ${target} is ready to duel!`);
            log.action('TOGGLE DUELIST ROLE', `🔄 ${targetTag} was given the duelist role by ${authorTag}`);
            await updateUserInDB(target);
        }
    } catch (error) {
        log.error(`❌ Error toggling duelist role for ${targetTag}:`, error);
        message.reply('❌ Something went wrong while toggling the duelist role.');
    }
}
