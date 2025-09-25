import { getInviteEmbed, CHANNELS } from '../../config/index.js';
import { saveInviteMessage, getInviteMessage } from '../../database/index.js';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

async function updateInviteMessage(message) {
    const channel = message.guild.channels.cache.get(CHANNELS.INFO.channels.README.id);
    if (!channel) throw new Error('Invite channel not found.');

    const embed = getInviteEmbed(message.client);

    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setLabel('Join Server')
            .setURL('https://discord.com/invite/VRR5X8ZdXB')
            .setStyle(ButtonStyle.Link)
    );

    const inviteMessageId = await getInviteMessage();

    if (inviteMessageId) {
        // Try to fetch existing message
        const sentMessage = await channel.messages.fetch(inviteMessageId).catch(() => null);
        if (sentMessage) {
            await sentMessage.edit({ embeds: [embed], components: [row] });
            return 'updated';
        }
        // If fetch failed, we'll just post a new message
    }

    // Post a new Invite message
    const sentMessage = await channel.send({ embeds: [embed], components: [row] });
    await saveInviteMessage(sentMessage.id);
    return 'posted';
}

export default {
    run: async (message) => {
        try {
            const result = await updateInviteMessage(message);

            if (result === 'posted') return message._send('✅ Invite message posted!');
            if (result === 'updated') return message._send('✅ Invite message updated!');
        } catch (err) {
            console.error(err);
            return message._send('❌ An unexpected error occurred while updating the Invite message.');
        }
    }
};
