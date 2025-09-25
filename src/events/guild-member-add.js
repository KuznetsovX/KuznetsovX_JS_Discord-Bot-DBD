import { CHANNELS, ROLE_EMOJIS, ROLES } from '../config/index.js';
import { User, getReadmeMessage, removeUserRoles, saveUserRoles, getUserRoles } from '../database/index.js';
import generateWelcomeCard from '../features/welcome/generate-welcome-card.js';
import log from '../utils/logging/log.js';
import { assignDefaultRole, restoreRoles, saveRoles } from '../utils/roles/role-manager.js';

const sendWithRetry = async (channel, member, card, maxRetries = 3, delayMs = 1000) => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            await channel.send({
                content: `<@${member.id}>`,
                files: [card]
            });
            log.action('GUILD MEMBER ADD', `✅ Sent welcome card to ${member.user.tag} (attempt ${attempt})`);
            return true;
        } catch (err) {
            log.error('GUILD MEMBER ADD', `❌ Attempt ${attempt} failed to send welcome card for ${member.user.tag}:`, err);
            if (attempt < maxRetries) {
                await new Promise(res => setTimeout(res, delayMs)); // wait before retry
            }
        }
    }
    return false; // all retries failed
};

const sendWelcomeImage = async (member) => {
    const channel = member.guild.channels.cache.get(CHANNELS.MAIN.channels.TEXT.id);
    if (!channel) {
        log.error('GUILD MEMBER ADD', `❌ Text channel not found.`);
        return;
    }

    try {
        const card = await generateWelcomeCard(member);
        await sendWithRetry(channel, member, card);
    } catch (error) {
        log.error('GUILD MEMBER ADD', `❌ Failed to generate/send welcome card for ${member.user.tag}:`, error);
    }
};

const syncReadmeReactionsForUser = async (member) => {
    try {
        const readmeChannel = member.guild.channels.cache.get(CHANNELS.INFO.channels.README.id);
        if (!readmeChannel) return log.warn('GUILD MEMBER ADD', 'Readme channel not found.');

        const readmeMessageId = await getReadmeMessage();
        if (!readmeMessageId) return log.warn('GUILD MEMBER ADD', 'Readme message ID not found.');

        const readmeMessage = await readmeChannel.messages.fetch(readmeMessageId).catch(() => null);
        if (!readmeMessage) return log.warn('GUILD MEMBER ADD', 'Readme message not found.');

        await readmeMessage.fetch();

        // Cache all reaction users upfront to reduce API calls
        const reactionUsersMap = {};
        for (const [emoji] of Object.entries(ROLE_EMOJIS)) {
            const reaction = readmeMessage.reactions.cache.get(emoji);
            reactionUsersMap[emoji] = reaction ? await reaction.users.fetch({ force: true }) : new Map();
        }

        const currentDbRoles = await getUserRoles(member.id);
        let updatedDbRoles = [...currentDbRoles];

        for (const [emoji, roleId] of Object.entries(ROLE_EMOJIS)) {
            const reactedUsers = reactionUsersMap[emoji];
            const reacted = reactedUsers.has(member.id);
            const hasRole = member.roles.cache.has(roleId);
            const roleLabel = Object.values(ROLES).find(r => r.id === roleId)?.label || roleId;

            if (reacted && !hasRole) {
                // Add role if user reacted but doesn't have it
                await member.roles.add(roleId).catch(() => null);
                if (!updatedDbRoles.includes(roleId)) updatedDbRoles.push(roleId);

                log.action('GUILD MEMBER ADD', `✅ Added role ${roleLabel} (${roleId}) to ${member.user.tag} based on Readme reaction`);
            } else if (!reacted && hasRole) {
                // Remove role if user didn't react but has it
                await member.roles.remove(roleId).catch(() => null);
                updatedDbRoles = updatedDbRoles.filter(r => r !== roleId);
                await removeUserRoles(member.id, roleId);

                log.action('GUILD MEMBER ADD', `🗑️ Removed role ${roleLabel} (${roleId}) from ${member.user.tag} (no reaction)`);
            }
        }

        if (JSON.stringify(currentDbRoles) !== JSON.stringify(updatedDbRoles)) {
            await saveUserRoles(member.id, updatedDbRoles);
        }

    } catch (err) {
        log.error('GUILD MEMBER ADD', `❌ Failed to sync Readme reactions for ${member.user.tag}:`, err);
    }
};

export default async function guildMemberAdd(member) {
    try {
        const existsInDB = await User.findOne({ where: { userId: member.id } });

        if (existsInDB) {
            await restoreRoles(member);
            await syncReadmeReactionsForUser(member);
        } else {
            await assignDefaultRole(member);
            await sendWelcomeImage(member);
        }

        await saveRoles(member);
    } catch (err) {
        log.error('GUILD MEMBER ADD', `❌ Unexpected error for member ${member.user.tag}:`, err);
    }
}
