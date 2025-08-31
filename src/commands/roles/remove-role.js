import { ROLES } from '../../config/index.js';
import { saveRoles, assignDefaultRole } from '../../utils/roles/role-manager.js';

export default {
    run: async (message) => {
        try {
            const author = message.member;
            const mentioned = message.mentions.members.first();
            if (!mentioned) return message._send(`❌ Please mention a user to remove a role from.`);

            const mentionedRole = message.mentions.roles.first();
            if (!mentionedRole) return message._send(`❌ Please mention a role to remove.`);

            if (!mentioned.roles.cache.has(mentionedRole.id)) {
                return message._send(`⚠️ User does not have this role.`);
            }

            if (mentionedRole.position >= author.roles.highest.position) {
                return message._send(`❌ You cannot remove a role equal to or higher than your highest role.`);
            }

            if (mentionedRole.position >= message.guild.members.me.roles.highest.position) {
                return message._send(`❌ I do not have permission to remove that role.`);
            }

            await mentioned.roles.remove(mentionedRole);

            const roleConfig = Object.values(ROLES).find(r => r.id === mentionedRole.id);
            if (roleConfig?.tier) {
                const hasTierRole = Object.values(ROLES)
                    .filter(r => r.tier)
                    .some(r => mentioned.roles.cache.has(r.id));

                if (!hasTierRole) await assignDefaultRole(mentioned);
            }

            await saveRoles(mentioned);

            return message._send(`✅ Role was successfully removed from the user.`);
        } catch (error) {
            throw new Error(`Failed to remove role ${message.mentions.roles.first()?.name || 'unknown'} from ${message.mentions.members.first()?.user.tag || 'unknown'}: ${error.message}`);
        }
    }
};
