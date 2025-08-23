import { removeUserFromDB } from '../../db/utils/remove-user-from-db.js';

export default {
    run: async (message) => {
        const args = message.content.trim().split(/\s+/);
        const mentioned = message.mentions.members.first();

        const isValidSnowflake = (id) => /^\d{17,20}$/.test(id);

        if (mentioned) {
            if (!mentioned.bannable) {
                return message.reply('❌ I cannot ban this user.');
            }

            try {
                await mentioned.ban();
                await removeUserFromDB(mentioned);
                await message.reply(`🔨 User was banned from the server.`);
            } catch (error) {
                throw new Error(`Failed to ban ${mentioned.user.tag}: ${error.message}`);
            }
        } else if (args[1] && isValidSnowflake(args[1])) {
            const userId = args[1];

            try {
                await message.guild.bans.create(userId);
                await removeUserFromDB(mentioned);
                await message.reply(`🔨 User was banned from the server.`);
            } catch (error) {
                throw new Error(`Failed to ban user by ID ${userId}: ${error.message}`);
            }
        } else {
            return message.reply('❌ Please mention a user or provide a valid numeric user ID to ban.');
        }
    }
};
