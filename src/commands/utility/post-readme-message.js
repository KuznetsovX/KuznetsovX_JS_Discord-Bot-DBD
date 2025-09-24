import { saveReadmeMessage } from '../../database/index.js';
import { getReadmeEmbed, CHANNELS } from '../../config/index.js';

export default {
    run: async (message) => {
        const channel = message.guild.channels.cache.get(CHANNELS.INFO.channels.README.id);
        if (!channel) return message._send('❌ Readme channel not found.');

        const embed = getReadmeEmbed(message.client);

        const sentMessage = await channel.send({ embeds: [embed] });
        await saveReadmeMessage(sentMessage.id);
        await sentMessage.react('🔔');

        return message._send('✅ Readme message posted!');
    }
};
