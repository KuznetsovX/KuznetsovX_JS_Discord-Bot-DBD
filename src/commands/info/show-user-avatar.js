export default {
    run: async (message) => {
        try {
            // Determine the target user (mentioned user or message author)
            const target = message.mentions.users.first() || message.author;

            // Get the URL for the avatar image
            const avatarURL = target.displayAvatarURL({ dynamic: true, size: 512 });

            await message.reply({ content: `🖼️ Avatar of **${target.tag}**:`, files: [avatarURL] });
        } catch (error) {
            throw new Error(`Failed to show avatar: ${error.message}`);
        }
    }
};
