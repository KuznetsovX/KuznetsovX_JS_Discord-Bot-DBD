import { ROLES } from '../../config/index.js';
import { saveRoles } from '../../utils/roles/role-manager.js';

export default {
    run: async (message) => {
        try {
            const member = message.member;
            const role = message.guild.roles.cache.get(ROLES.NOTIFICATIONS.id);
            if (!role) return message._send(`❌ I could not find the notifications role.`);

            if (member.roles.cache.has(ROLES.NOTIFICATIONS.id)) {
                await member.roles.remove(ROLES.NOTIFICATIONS.id);
                await message._send(`🔕 You will no longer receive notifications about games, updates, guides, etc.`);
            } else {
                await member.roles.add(ROLES.NOTIFICATIONS.id);
                await message._send(`🔔 You will now receive notifications about games, updates, guides, etc.`);
            }

            await saveRoles(member);
        } catch (error) {
            throw new Error(`Failed to toggle notifications role for ${message.member.user.tag}: ${error.message}`);
        }
    }
};
