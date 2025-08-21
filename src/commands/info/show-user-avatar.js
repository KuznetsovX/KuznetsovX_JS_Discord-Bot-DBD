export default {
    run: async (message) => {
        // Determine the target user (mentioned user or message author)
        const target = message.mentions.users.first() || message.author;

        // Get the URL for the avatar image
        const avatarURL = target.displayAvatarURL({ dynamic: true, size: 512 });

        // Reply to the original message with the avatar
        await message.reply({
            content: `🖼️ Avatar of **${target.tag}**:`,
            files: [avatarURL]
        });
    }
};
