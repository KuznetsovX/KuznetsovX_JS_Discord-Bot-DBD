import { User } from '../../db/user-model.js';
import { syncUserToDB } from '../../db/utils/sync-user-to-db.js';

export default {
    run: async (message) => {
        try {
            const mentioned = message.mentions.members.first();
            if (!mentioned) {
                return message.reply('❌ Please mention a user to unwarn.');
            }

            const user = await User.findOne({ where: { userId: mentioned.id } });
            if (!user || user.warnings === 0) {
                return message.reply(`⚠️ User **${mentioned.user.tag}** has no warnings to remove.`);
            }

            user.warnings -= 1;
            await user.save();
            await syncUserToDB(mentioned);

            return message.reply(`✅ Removed a warning from user. Total warnings: ${user.warnings}`);
        } catch (error) {
            throw new Error(`Failed to remove a warning: ${error.message}`);
        }
    }
};
