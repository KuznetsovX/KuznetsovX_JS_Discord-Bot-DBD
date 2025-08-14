import log from '../utils/log.js';

export default {
    run: async (message) => {
        // Determine the target user (mentioned user or message author)
        const target = message.mentions.users.first() || message.author;
        // Get the URL for the avatar image
        const avatarURL = target.displayAvatarURL({ dynamic: true, size: 512 });
        // Capture the author of the message making the request
        const requester = message.author;

        // Log the action of requesting an avatar
        log.action('SHOW USER AVATAR', `Requested avatar for user: ${target.tag} by ${requester.tag}`);

        // Send the avatar image to the channel
        await message.channel.send({
            content: `🖼️ Avatar of **${target.tag}**:`,
            files: [avatarURL]
        });

        // Log the successful sending of the avatar
        log.action('SHOW USER AVATAR', `Avatar sent successfully for user: ${target.tag} by ${requester.tag}`);
    }
};
