import { User } from '../../db/user-model.js';
import { ROLES, COMMANDS } from '../../config/index.js';
import { syncUserToDB } from '../../db/utils/sync-user-to-db.js';
import { removeUserFromDB } from '../../db/utils/remove-user-from-db.js';

export default {
    run: async (message, args) => {
        try {
            const mentioned = message.mentions.members.first();
            if (!mentioned) return message._send('❌ Please mention a user to warn.');

            const authorMember = message.member;
            const isAdmin = authorMember.roles.cache.has(ROLES.ADMIN.id);

            if (mentioned.user.bot || mentioned.roles.cache.has(ROLES.ADMIN.id)) {
                return message._send('⚠️ Cannot warn admins or bots.');
            }

            if (!isAdmin) {
                const authorHighestRole = authorMember.roles.highest.position;
                const mentionedHighestRole = mentioned.roles.highest.position;
                if (mentionedHighestRole >= authorHighestRole) {
                    return message._send('⚠️ You cannot warn users with the same or higher roles.');
                }
            }

            const reason = args.slice(1).join(' ') || 'No reason provided';
            const maxWarns = COMMANDS.moderation.warnUser.warns;
            const moderatorLimit = Math.min(2, maxWarns - 1);

            const [user] = await User.findOrCreate({
                where: { userId: mentioned.id },
                defaults: { username: mentioned.user.tag, warnings: 0 }
            });

            if (!isAdmin && user.warnings >= moderatorLimit) {
                return message._send(`⚠️ You cannot give more than ${moderatorLimit} warnings. Only admins can give further warnings.`);
            }

            user.warnings += 1;
            await user.save();
            await syncUserToDB(mentioned);

            if (user.warnings >= maxWarns) {
                try {
                    await mentioned.ban({ reason: `Reached ${maxWarns} warnings. Last reason: ${reason}` });
                    await removeUserFromDB(mentioned);
                    return message._send(`🔨 User has been banned after ${maxWarns} warnings.`);
                } catch (banError) {
                    throw new Error(`Failed to ban ${mentioned.user.tag}: ${banError.message}`);
                }
            }

            if (user.warnings === maxWarns - 1) {
                try {
                    await mentioned.kick({ reason: `Reached ${maxWarns - 1} warnings. Last reason: ${reason}` });
                    return message._send(`🚪 User has been kicked after ${maxWarns - 1} warnings.`);
                } catch (kickError) {
                    throw new Error(`Failed to kick ${mentioned.user.tag}: ${kickError.message}`);
                }
            }

            return message._send(`⚠️ User has been warned. Total warnings: ${user.warnings}`);
        } catch (error) {
            throw new Error(`Failed to warn ${mentioned?.user?.tag || 'unknown'}: ${error.message}`);
        }
    }
};
