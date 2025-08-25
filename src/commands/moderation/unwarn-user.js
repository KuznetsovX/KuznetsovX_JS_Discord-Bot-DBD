import { User } from '../../db/user-model.js';
import config from '../../config/index.js';
import { syncUserToDB } from '../../db/utils/sync-user-to-db.js';

export default {
    run: async (message) => {
        try {
            const mentioned = message.mentions.members.first();
            if (!mentioned) {
                return message._send('❌ Please mention a user to unwarn.');
            }

            const authorMember = message.member;
            const isAdmin = authorMember.roles.cache.has(config.ROLES.ADMIN);

            const user = await User.findOne({ where: { userId: mentioned.id } });
            if (!user || user.warnings === 0) {
                return message._send(`⚠️ User has no warnings to remove.`);
            }

            const maxWarns = config.commands.moderation.warnUser.warns;
            const moderatorLimit = maxWarns - 1;

            if (!isAdmin && user.warnings >= moderatorLimit) {
                return message._send(`⚠️ Only admins can remove warnings from users with ${moderatorLimit} or more warnings.`);
            }

            if (!isAdmin) {
                const authorHighestRole = authorMember.roles.highest.position;
                const mentionedHighestRole = mentioned.roles.highest.position;
                if (mentionedHighestRole >= authorHighestRole) {
                    return message._send('⚠️ You cannot remove warnings from users with the same or higher roles.');
                }
            }

            user.warnings -= 1;
            await user.save();
            await syncUserToDB(mentioned);

            return message._send(`✅ Removed a warning from user. Total warnings: ${user.warnings}`);
        } catch (error) {
            throw new Error(`Failed to remove a warning: ${error.message}`);
        }
    }
};
