import { ROLES } from '../config/index.js';
import { getReadmeMessage } from '../database/index.js';
import log from '../utils/logging/log.js';
import { saveRoles } from '../utils/roles/role-manager.js';

export default function reactionRoleHandler(client) {
    const emojiRoleMap = {
        '🔔': ROLES.NOTIFICATIONS.id,
        '⚔️': ROLES.DUELIST.id,
    };

    client.on('messageReactionAdd', async (reaction, user) => {
        if (user.bot) return;
        if (reaction.partial) await reaction.fetch();

        const guild = reaction.message.guild;
        const readmeId = await getReadmeMessage();
        if (reaction.message.id !== readmeId) return;

        const member = await guild.members.fetch(user.id).catch(() => null);
        if (!member) return;

        const roleId = emojiRoleMap[reaction.emoji.name];
        if (!roleId) return;

        if (!member.roles.cache.has(roleId)) {
            await member.roles.add(roleId).catch(() => null);
            log.action('REACTION ROLE', `${reaction.emoji.name} role added to ${member.user.tag} (${member.id})`);
            await saveRoles(member);
        }
    });

    client.on('messageReactionRemove', async (reaction, user) => {
        if (user.bot) return;
        if (reaction.partial) await reaction.fetch();

        const guild = reaction.message.guild;
        const readmeId = await getReadmeMessage();
        if (reaction.message.id !== readmeId) return;

        const member = await guild.members.fetch(user.id).catch(() => null);
        if (!member) return;

        const roleId = emojiRoleMap[reaction.emoji.name];
        if (!roleId) return;

        if (member.roles.cache.has(roleId)) {
            await member.roles.remove(roleId).catch(() => null);
            log.action('REACTION ROLE', `${reaction.emoji.name} role removed from ${member.user.tag} (${member.id})`);
            await saveRoles(member);
        }
    });
}
