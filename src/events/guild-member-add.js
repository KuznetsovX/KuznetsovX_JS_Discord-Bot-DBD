import { CHANNELS } from '../config/index.js';
import { User } from '../db/index.js';
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

export default async function guildMemberAdd(member) {
    try {
        const existsInDB = await User.findOne({ where: { userId: member.id } });

        if (existsInDB) {
            await restoreRoles(member);
        } else {
            await assignDefaultRole(member);
            await sendWelcomeImage(member);
        }

        await saveRoles(member);
    } catch (err) {
        log.error('GUILD MEMBER ADD', `❌ Unexpected error for member ${member.user.tag}:`, err);
    }
}
