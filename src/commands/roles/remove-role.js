import config from '../../config/index.js';
import { syncUserToDB } from '../../db/utils/sync-user-to-db.js';
import autoAssignDefaultRole from '../../utils/roles/auto-assign-default-role.js';

export default {
    run: async (message) => {
        const mentioned = message.mentions.members.first();
        if (!mentioned) {
            return message.channel.send(`❌ ${author}, please mention a user to remove a role from.`);
        }

        const mentionedRole = message.mentions.roles.first();
        if (!mentionedRole) {
            return message.channel.send(`❌ ${author}, please mention a role to remove.`);
        }

        if (!mentioned.roles.cache.has(mentionedRole.id)) {
            return message.channel.send(`⚠️ ${author}, user does not have this role.`);
        }

        const authorHighest = author.roles.highest;
        if (mentionedRole.position >= authorHighest.position) {
            return message.channel.send(`❌ ${author}, you cannot remove a role equal to or higher than your highest role.`);
        }

        const botMember = message.guild.members.me;
        if (!botMember || mentionedRole.position >= botMember.roles.highest.position) {
            return message.channel.send(`❌ ${author}, I do not have permission to remove that role.`);
        }

        try {
            await mentioned.roles.remove(mentionedRole);
            await syncUserToDB(mentioned);

            if (config.ROLE_TIERS.includes(mentionedRole.id)) {
                const hasTierRole = config.ROLE_TIERS.some(roleId => mentioned.roles.cache.has(roleId));
                if (!hasTierRole) {
                    await autoAssignDefaultRole(message.guild);
                }
            }

            await message.channel.send(`✅ ${author}, role was successfully removed from the user.`);
        } catch (error) {
            throw new Error(`Failed to remove role ${mentionedRole.name} from ${mentioned.user.tag}: ${error.message}`);
        }
    }
};
