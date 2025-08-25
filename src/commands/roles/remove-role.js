import config from '../../config/index.js';
import { syncUserToDB } from '../../db/utils/sync-user-to-db.js';
import autoAssignDefaultRole from '../../utils/roles/auto-assign-default-role.js';

export default {
    run: async (message) => {
        try {
            const author = message.member;
            const mentioned = message.mentions.members.first();
            if (!mentioned) {
                return message._send(`❌ Please mention a user to remove a role from.`);
            }

            const mentionedRole = message.mentions.roles.first();
            if (!mentionedRole) {
                return message._send(`❌ Please mention a role to remove.`);
            }

            if (!mentioned.roles.cache.has(mentionedRole.id)) {
                return message._send(`⚠️ User does not have this role.`);
            }

            const authorHighest = author.roles.highest;
            if (mentionedRole.position >= authorHighest.position) {
                return message._send(`❌ You cannot remove a role equal to or higher than your highest role.`);
            }

            const botMember = message.guild.members.me;
            if (!botMember || mentionedRole.position >= botMember.roles.highest.position) {
                return message._send(`❌ I do not have permission to remove that role.`);
            }

            await mentioned.roles.remove(mentionedRole);
            await syncUserToDB(mentioned);

            if (config.ROLE_TIERS.includes(mentionedRole.id)) {
                const hasTierRole = config.ROLE_TIERS.some(roleId => mentioned.roles.cache.has(roleId));
                if (!hasTierRole) {
                    await autoAssignDefaultRole(message.guild);
                }
            }

            return message._send(`✅ Role was successfully removed from the user.`);
        } catch (error) {
            throw new Error(`Failed to remove role ${message.mentions.roles.first()?.name || 'unknown'} from ${message.mentions.members.first()?.user.tag || 'unknown'}: ${error.message}`);
        }
    }
};
