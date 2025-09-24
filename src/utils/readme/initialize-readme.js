import { getReadmeEmbed, CHANNELS, ROLE_EMOJIS, ROLES } from '../../config/index.js';
import { getReadmeMessage, saveReadmeMessage } from '../../database/index.js';
import log from '../logging/log.js';
import { saveRoles } from '../roles/role-manager.js';

export async function initReadme(client, guild) {
    const channel = guild.channels.cache.get(CHANNELS.INFO.channels.README.id);
    if (!channel) {
        return log.warn('INITIALIZE README', 'Readme channel not found.');
    }

    let messageId = await getReadmeMessage();
    let message;

    if (messageId) {
        message = await channel.messages.fetch(messageId).catch(() => null);
    }

    if (!message) {
        message = await channel.send({ embeds: [getReadmeEmbed(client)] });
        await message.react('🔔');
        await saveReadmeMessage(message.id);
        log.info('INITIALIZE README', 'Posted new Readme message.');
    }

    // Store the message in the client for live reaction tracking
    client.readmeMessage = message;

    // Only sync reactions if the message already existed
    if (messageId) {
        log.info('INITIALIZE README', 'Starting to sync user roles based on Readme message reactions...');
        await syncReactionsToRoles(client, guild, message);
        log.action('INITIALIZE README', 'Finished syncing user roles from Readme reactions.');
    }
}

async function syncReactionsToRoles(_client, guild, message) {
    await message.fetch();

    const allMembers = await guild.members.fetch();

    // Loop through all mapped emojis
    for (const [emoji, roleId] of Object.entries(ROLE_EMOJIS)) {
        const reaction = message.reactions.cache.get(emoji);

        // Users who reacted
        const reactedUsers = reaction ? await reaction.users.fetch({ force: true }) : new Map();

        // Add roles for users who reacted but don’t have the role
        for (const [userId, user] of reactedUsers) {
            if (user.bot) continue;
            const member = allMembers.get(userId);
            if (!member) continue;

            if (!member.roles.cache.has(roleId)) {
                await member.roles.add(roleId).catch(() => null);
                const roleLabel = Object.values(ROLES).find(r => r.id === roleId)?.label || roleId;
                log.action('INITIALIZE README', `Added role ${roleLabel} to ${member.user.tag} based on ${emoji} reaction`);
                const updatedMember = await guild.members.fetch(member.id);
                await saveRoles(updatedMember);
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
                log.action('INITIALIZE README', `Removed role ${roleLabel} from ${member.user.tag} because they removed ${emoji} reaction`);
                const updatedMember = await guild.members.fetch(member.id);
                await saveRoles(updatedMember);
            }
        }
    }
}
