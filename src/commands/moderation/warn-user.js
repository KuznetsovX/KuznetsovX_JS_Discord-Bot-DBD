import { User } from '../../db/user-model.js';
import config from '../../config/index.js';
import { syncUserToDB } from '../../db/utils/sync-user-to-db.js';
import { removeUserFromDB } from '../../db/utils/remove-user-from-db.js';

export default {
    run: async (message, args) => {
        const mentioned = message.mentions.members.first();
        if (!mentioned) return message.reply('❌ Please mention a user to warn.');

        if (mentioned.user.bot || mentioned.roles.cache.has(config.ROLES.ADMIN)) {
            return message.reply('⚠️ Cannot warn admins or bots.');
        }

        const reason = args.slice(1).join(' ') || 'No reason provided';
        const maxWarns = config.commands.moderation.warnUser.warns;

        const [user] = await User.findOrCreate({
            where: { userId: mentioned.id },
            defaults: { username: mentioned.user.tag, warnings: 0 }
        });

        user.warnings += 1;
        await user.save();
        await syncUserToDB(mentioned);

        if (user.warnings >= maxWarns) {
            try {
                await mentioned.ban({ reason: `Reached ${maxWarns} warnings. Last reason: ${reason}` });
                await removeUserFromDB(mentioned);
                message.reply(`🔨 User has been banned after ${maxWarns} warnings.`);
            } catch {
                message.reply(`❌ Failed to ban user.`);
            }
        } else if (user.warnings === maxWarns - 1) {
            try {
                await mentioned.kick({ reason: `Reached ${maxWarns - 1} warnings. Last reason: ${reason}` });
                message.reply(`🚪 User has been kicked after ${maxWarns - 1} warnings.`);
            } catch {
                message.reply(`❌ Failed to kick user.`);
            }
        } else {
            message.reply(`⚠️ User has been warned. Total warnings: ${user.warnings}`);
        }
    }
};
