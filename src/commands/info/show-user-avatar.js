import { EmbedBuilder } from 'discord.js';
import setDefaultEmbedFooter from '../../utils/embeds/set-default-embed-footer.js';

export default {
    run: async (message, _args, commandKey) => {
        try {
            // Determine the target user (mentioned user or message author)
            const target = message.mentions.users.first() || message.author;

            // Get the URL for the avatar image
            const avatarURL = target.displayAvatarURL({ dynamic: true, size: 512 });

            // Build embed message
            const embed = new EmbedBuilder()
                .setTitle(`🖼️ Avatar of ${target.tag}`)
                .setImage(avatarURL)
                .setColor('Purple');
            setDefaultEmbedFooter(embed, message, commandKey);

            await message._send({ embeds: [embed] });
        } catch (error) {
            throw new Error(`❌ Failed to show avatar: ${error instanceof Error ? error.message : error}`);
        }
    }
};
