import { ROLES } from '../config/index.js';
import { getReadmeMessage } from '../database/index.js';
import log from '../utils/logging/log.js';
import { saveRoles } from '../utils/roles/role-manager.js';

export default function reactionRoleHandler(client) {
    client.on('messageReactionAdd', async (reaction, user) => {
        if (user.bot) return;
        if (reaction.partial) await reaction.fetch();

        const guild = reaction.message.guild;
        const readmeId = await getReadmeMessage();
        if (reaction.message.id !== readmeId) return;

        const member = await guild.members.fetch(user.id).catch(() => null);
        if (!member) return;

        let changed = false;

        if (reaction.emoji.name === '🔔' && !member.roles.cache.has(ROLES.NOTIFICATIONS.id)) {
            await member.roles.add(ROLES.NOTIFICATIONS.id).catch(() => null);
            changed = true;
            log.action('REACTION ROLE', `🔔 Notifications role added to ${member.user.tag} (${member.id})`);
        }

        if (changed) {
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

        let changed = false;

        if (reaction.emoji.name === '🔔' && member.roles.cache.has(ROLES.NOTIFICATIONS.id)) {
            await member.roles.remove(ROLES.NOTIFICATIONS.id).catch(() => null);
            changed = true;
            log.action('REACTION ROLE', `🔔 Notifications role removed from ${member.user.tag} (${member.id})`);
        }

        if (changed) {
            await saveRoles(member);
        }
    });
}
