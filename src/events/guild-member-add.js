import { CHANNELS } from '../config/index.js';
import { User } from '../db/index.js';
import log from '../utils/logging/log.js';
import { assignDefaultRole, restoreRoles, saveRoles } from '../utils/roles/role-manager.js';
import generateWelcomeCard from '../utils/generate-welcome-card.js';

const sendWelcomeImage = async (member) => {
    const channel = member.guild.channels.cache.get(CHANNELS.MAIN.channels.TEXT.id);

    if (!channel) {
        log.error('GUILD MEMBER ADD', `❌ Main text channel not found.`);
        return;
    }

    try {
        const card = await generateWelcomeCard(member);
        await channel.send({
            content: `<@${member.id}>`,
            files: [card]
        });
        log.action('GUILD MEMBER ADD', `✅ Sent welcome card to ${member.user.tag}.`);
    } catch (error) {
        log.error('GUILD MEMBER ADD', `❌ Failed to send welcome card for ${member.user.tag}:`, error);
    }
};

export default async function guildMemberAdd(member) {
    const existsInDB = await User.findOne({ where: { userId: member.id } });

    if (existsInDB) {
        await restoreRoles(member);
    } else {
        await assignDefaultRole(member);
        await sendWelcomeImage(member);
    }

    await saveRoles(member);
}
