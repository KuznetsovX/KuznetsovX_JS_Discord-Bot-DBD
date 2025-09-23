import { ROLES } from '../../config/index.js';
import { saveRoles, manageTierRoles, assignDefaultRole } from '../../utils/roles/role-manager.js';

const ACTION_ALIASES = {
    add: ['add', 'give', '+'],
    remove: ['remove', 'take', '-', 'rm'],
};

function normalizeAction(action) {
    for (const [key, aliases] of Object.entries(ACTION_ALIASES)) {
        if (aliases.includes(action)) return key;
    }
    return null;
}

export default {
    run: async (message) => {
        try {
            const args = message.content.trim().split(/\s+/);
            const rawAction = args[1]?.toLowerCase();
            const action = normalizeAction(rawAction);

            if (!action) {
                return message._send(`❌ Usage: \`!role add @user @role\` (\`+\`, \`give\`) or \`!role remove @user @role\` (\`-\`, \`take\`)`);
            }

            const author = message.member;
            const mentioned = message.mentions.members.first();
            if (!mentioned) {
                return message._send(`❌ Please mention a user.`);
            }

            const mentionedRole = message.mentions.roles.first();
            if (!mentionedRole) {
                return message._send(`❌ Please mention a role.`);
            }

            if (mentionedRole.position >= author.roles.highest.position) {
                return message._send(`❌ You cannot manage a role equal to or higher than your highest role.`);
            }

            if (mentionedRole.position >= message.guild.members.me.roles.highest.position) {
                return message._send(`❌ I do not have permission to manage that role.`);
            }

            if (action === 'add') {
                if (mentioned.roles.cache.has(mentionedRole.id)) {
                    return message._send(`⚠️ User already has this role.`);
                }

                await mentioned.roles.add(mentionedRole);

                const roleConfig = Object.values(ROLES).find(r => r.id === mentionedRole.id);
                if (roleConfig?.tier) {
                    await manageTierRoles(mentioned);
                }

                await saveRoles(mentioned);
                return message._send(`✅ Role was successfully added to the user.`);
            }

            if (action === 'remove') {
                if (!mentioned.roles.cache.has(mentionedRole.id)) {
                    return message._send(`⚠️ User does not have this role.`);
                }

                await mentioned.roles.remove(mentionedRole);

                const roleConfig = Object.values(ROLES).find(r => r.id === mentionedRole.id);
                if (roleConfig?.tier) {
                    const hasTierRole = Object.values(ROLES)
                        .filter(r => r.tier)
                        .some(r => mentioned.roles.cache.has(r.id));

                    if (!hasTierRole) {
                        await assignDefaultRole(mentioned);
                    }
                }

                await saveRoles(mentioned);
                return message._send(`✅ Role was successfully removed from the user.`);
            }
        } catch (error) {
            throw new Error(
                `Failed to manage role ${message.mentions.roles.first()?.name || 'unknown'} for ${message.mentions.members.first()?.user.tag || 'unknown'}: ${error.message}`
            );
        }
    }
};
