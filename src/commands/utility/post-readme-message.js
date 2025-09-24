import { EmbedBuilder } from 'discord.js';
import { saveReadmeMessage } from '../../database/index.js';
import { CHANNELS, README } from '../../config/index.js';

export default {
    run: async (message) => {
        const RULES_TEXT = README.RULES_TEXT.join("\n");
        const ROLES_TEXT = README.ROLES_TEXT.join("\n");

        const embed = new EmbedBuilder()
            .setAuthor({
                name: "DBD.exe",
                url: "https://discord.com/invite/VRR5X8ZdXB",
            })
            .addFields(
                { name: "Rules", value: RULES_TEXT },
                { name: "Notifications", value: ROLES_TEXT }
            )
            .setColor('Purple')
            .setFooter({
                text: "Readme",
                iconURL: message.client.user.displayAvatarURL()
            });

        const channel = message.guild.channels.cache.get(CHANNELS.INFO.channels.README.id);
        if (!channel) return message._send('❌ Readme channel not found.');

        const sentMessage = await channel.send({ embeds: [embed] });

        await saveReadmeMessage(sentMessage.id);

        await sentMessage.react('🔔');

        return message._send('✅ Readme message posted!');
    }
};
