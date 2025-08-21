import config from '../../config/index.js';
import { updateUserInDB } from '../../db/utils/update-user-db.js';

export default {
    run: async (message) => {
        const member = message.member;

        const role = message.guild.roles.cache.get(config.ROLES.DUELIST);
        if (!role) {
            return message.reply(`❌ ${member}, I could not find the duelist role.`);
        }

        try {
            if (member.roles.cache.has(config.ROLES.DUELIST)) {
                await member.roles.remove(config.ROLES.DUELIST);
                await message.reply(`🚫 ${member} no longer wishes to participate in 1v1's.`);
            } else {
                await member.roles.add(config.ROLES.DUELIST);
                await message.reply(`⚔️ ${member} is ready for 1v1's!`);
            }

            await updateUserInDB(member);
        } catch (error) {
            throw new Error(`Failed to toggle duelist role for ${member.user.tag}: ${error.message}`);
        }
    }
};
