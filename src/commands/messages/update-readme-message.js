import { saveReadmeMessage, getReadmeMessage } from '../../database/index.js';
import { getReadmeEmbed, CHANNELS } from '../../config/index.js';

async function updateReadmeMessage(message) {
    const channel = message.guild.channels.cache.get(CHANNELS.INFO.channels.README.id);
    if (!channel) throw new Error('Readme channel not found.');

    const embed = getReadmeEmbed(message.client);

    const readmeMessageId = await getReadmeMessage();

    if (readmeMessageId) {
        // Try to fetch existing message
        const sentMessage = await channel.messages.fetch(readmeMessageId).catch(() => null);
        if (sentMessage) {
            await sentMessage.edit({ embeds: [embed] });
            await ensureReactions(sentMessage);
            return 'updated';
        }
        // If fetch failed, we'll just post a new message
    }

    // Post a new Readme message
    const sentMessage = await channel.send({ embeds: [embed] });
    await saveReadmeMessage(sentMessage.id);
    await ensureReactions(sentMessage);
    return 'posted';
}

async function ensureReactions(message) {
    const emojis = ['🔔', '⚔️'];
    for (const emoji of emojis) {
        if (!message.reactions.cache.has(emoji)) {
            await message.react(emoji);
        }
    }
}


export default {
    run: async (message) => {
        try {
            const result = await updateReadmeMessage(message);

            if (result === 'posted') return message._send('✅ Readme message posted!');
            if (result === 'updated') return message._send('✅ Readme message updated!');
        } catch (error) {
            throw new Error(`❌ Failed to update readme message: ${error instanceof Error ? error.message : error}`);
        }
    }
};
