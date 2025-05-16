const log = require('../utils/log');

module.exports = async (message) => {
    const target = message.mentions.users.first() || message.author;
    const avatarURL = target.displayAvatarURL({ dynamic: true, size: 512 });
    const requester = message.author;  // Capturing the requester's user

    log.action('SHOW USER AVATAR', `Requested avatar for user: ${target.tag} by ${requester.tag}`);

    await message.channel.send({
        content: `🖼️ Avatar of **${target.tag}**:`,
        files: [avatarURL]
    });

    log.action('SHOW USER AVATAR', `Avatar sent successfully for user: ${target.tag} by ${requester.tag}`);
};
