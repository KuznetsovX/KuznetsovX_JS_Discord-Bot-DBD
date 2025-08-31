import { ROLES } from '../../config/index.js';
import { manageTierRoles } from '../../utils/roles/role-manager.js';

export default {
    run: async (message) => {
        try {
            const author = message.member;
            const mentioned = message.mentions.members.first();
            if (!mentioned) {
                return message._send(`❌ Please mention a user to add a role to.`);
            }

            const mentionedRole = message.mentions.roles.first();
            if (!mentionedRole) {
                return message._send(`❌ Please mention a role to add.`);
            }

            if (mentioned.roles.cache.has(mentionedRole.id)) {
                return message._send(`⚠️ User already has this role.`);
            }

            if (mentionedRole.position >= author.roles.highest.position) {
                return message._send(`❌ You cannot assign a role equal to or higher than your highest role.`);
            }

            if (mentionedRole.position >= message.guild.members.me.roles.highest.position) {
                return message._send(`❌ I do not have permission to assign that role.`);
            }

            await mentioned.roles.add(mentionedRole);

            const roleConfig = Object.values(ROLES).find(r => r.id === mentionedRole.id);
            if (roleConfig?.tier) {
                await manageTierRoles(mentioned);
            }

            await saveRoles(mentioned);

            return message._send(`✅ Role was successfully added to the user.`);
        } catch (error) {
            throw new Error(`Failed to add role ${message.mentions.roles.first()?.name || 'unknown'} to ${message.mentions.members.first()?.user.tag || 'unknown'}: ${error.message}`);
        }
    }
};
