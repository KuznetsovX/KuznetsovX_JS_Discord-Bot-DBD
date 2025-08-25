import config from '../../config/index.js';
import { syncUserToDB } from '../../db/utils/sync-user-to-db.js';

export default {
    run: async (message) => {
        try {
            const member = message.member;
            const role = message.guild.roles.cache.get(config.ROLES.DUELIST);

            if (!role) {
                return message._send(`❌ I could not find the duelist role.`);
            }

            if (member.roles.cache.has(config.ROLES.DUELIST)) {
                await member.roles.remove(config.ROLES.DUELIST);
                await message._send(`🚫 You are no longer participating in 1v1's.`);
            } else {
                await member.roles.add(config.ROLES.DUELIST);
                await message._send(`⚔️ You are now participating in 1v1's!`);
            }

            await syncUserToDB(member);
        } catch (error) {
            throw new Error(`Failed to toggle duelist role for ${message.member.user.tag}: ${error.message}`);
        }
    }
};
