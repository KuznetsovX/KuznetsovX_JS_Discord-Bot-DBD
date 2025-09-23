import { EmbedBuilder } from 'discord.js';
import { saveReadmeMessage } from '../../database/index.js';
import { CHANNELS } from '../../config/index.js';

export default {
    run: async (message) => {

        const RULES_TEXT = [
            "• Treat everyone with respect.",
            "• No spam or self-promotion without staff permission.",
            "• No age-restricted or obscene content (text, images, or links)."
        ].join("\n");

        const ROLES_TEXT = [
            "Click emoji below to get a corresponding role **(requires bot to be online)**:",
            "🔔 - notifications/pings",
            "",
            "Alternatively, use commands. Type `!help` when the bot is online."
        ].join("\n");

        const embed = new EmbedBuilder()
            .setAuthor({
                name: "DBD.exe",
                url: "https://discord.com/invite/VRR5X8ZdXB",
            })
            .addFields(
                { name: "Rules", value: RULES_TEXT },
                { name: "Notifications & Roles", value: ROLES_TEXT }
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
