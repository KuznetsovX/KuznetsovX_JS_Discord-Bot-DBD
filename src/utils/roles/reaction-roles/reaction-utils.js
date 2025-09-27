import { ROLES } from '../../config/index.js';
import log from '../logging/log.js';
import { saveRoles } from '../roles/role-manager.js';

/**
 * Ensure all specified reactions exist on a message
 * @param {Message} message
 * @param {Record<string, string>} roleEmojis
 */
export async function ensureReactions(message, roleEmojis) {
    for (const emoji of Object.keys(roleEmojis)) {
        if (!message.reactions.cache.has(emoji)) {
            await message.react(emoji).catch(() => null);
        }
    }
}

/**
 * Sync roles based on reactions on a message
 * @param {Guild} guild
 * @param {Message} message
 * @param {Record<string, string>} roleEmojis
 */
export async function syncReactionsToRoles(guild, message, roleEmojis) {
    await message.fetch();
    const allMembers = await guild.members.fetch();

    for (const [emoji, roleId] of Object.entries(roleEmojis)) {
        const reaction = message.reactions.cache.get(emoji);
        const reactedUsers = reaction ? await reaction.users.fetch({ force: true }) : new Map();

        // Add roles for users who reacted
        for (const [userId, user] of reactedUsers) {
            if (user.bot) continue;
            const member = allMembers.get(userId);
            if (!member) continue;
            if (!member.roles.cache.has(roleId)) {
                await member.roles.add(roleId).catch(() => null);
                const roleLabel = Object.values(ROLES).find(r => r.id === roleId)?.label || roleId;
                log.action('REACTION ROLES', `Added role ${roleLabel} to ${member.user.tag} for ${emoji} reaction`);
                await saveRoles(member);
            }
        }

        // Remove roles from users who removed reactions
        for (const member of allMembers.values()) {
            if (member.user.bot) continue;
            const hasRole = member.roles.cache.has(roleId);
            const reacted = reactedUsers.has(member.id);

            if (hasRole && !reacted) {
                await member.roles.remove(roleId).catch(() => null);
                const roleLabel = Object.values(ROLES).find(r => r.id === roleId)?.label || roleId;
                log.action('REACTION ROLES', `Removed role ${roleLabel} from ${member.user.tag} because ${emoji} was removed`);
                await saveRoles(member);
            }
        }
    }
}
