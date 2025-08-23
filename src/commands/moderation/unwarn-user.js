import { User } from '../../db/user-model.js';
import { syncUserToDB } from '../../db/utils/sync-user-to-db.js';

export default {
    run: async (message) => {
        const mentioned = message.mentions.members.first();
        if (!mentioned) return message.reply('❌ Please mention a user to unwarn.');

        try {
            const user = await User.findOne({ where: { userId: mentioned.id } });
            if (!user || user.warnings === 0) {
                return message.reply(`⚠️ User has no warnings to remove.`);
            }

            user.warnings -= 1;
            await user.save();
            await syncUserToDB(mentioned);

            message.reply(`✅ Removed a warning from user. Total warnings: ${user.warnings}`);
        } catch (error) {
            message.reply(`❌ Failed to remove a warning from user.`);
        }
    }
};
