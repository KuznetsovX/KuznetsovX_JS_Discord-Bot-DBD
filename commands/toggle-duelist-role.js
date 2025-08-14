import { DUEL_ROLE } from '../config/roles.js';
import log from '../utils/log.js';
import { updateUserInDB } from '../utils/update-user-db.js';

export default {
    run: async (message) => {
        const member = message.member;
        const memberTag = member.user.tag;

        // Get the "1v1 ME, BOT?" role from the guild
        const role = message.guild.roles.cache.get(DUEL_ROLE);
        if (!role) {
            log.action('TOGGLE DUELIST ROLE', `❌ "1v1 ME, BOT?" role not found.`);
            return message.reply('❌ Could not find the "1v1 ME, BOT?" role.');
        }

        try {
            if (member.roles.cache.has(DUEL_ROLE)) {
                // User already has the role — remove it
                await member.roles.remove(DUEL_ROLE);
                await message.channel.send(`🚫 ${member} is no longer available for duel.`);
                log.action('TOGGLE DUELIST ROLE', `🔄 ${memberTag} had the duelist role removed.`);
            } else {
                // User doesn't have the role — add it
                await member.roles.add(DUEL_ROLE);
                await message.channel.send(`⚔️ ${member} is ready to duel!`);
                log.action('TOGGLE DUELIST ROLE', `🔄 ${memberTag} was given the duelist role.`);
            }
            await updateUserInDB(member);
        } catch (error) {
            log.error(`❌ Error toggling duelist role for ${memberTag}:`, error);
            message.reply('❌ Something went wrong while toggling the duelist role.');
        }
    }
};
