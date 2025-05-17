const { ADMIN_ROLE, MUTED_ROLE } = require('../config/roles');
const log = require('../utils/log');

module.exports = async (message) => {
    // Ensure the user has the required role to use the command
    if (!message.member.roles.cache.has(ADMIN_ROLE)) {
        log.action('UNMUTE', `❌ ${message.author.tag} tried to use !unmute without permission.`);
        return message.reply('❌ You do not have permission to use this command.');
    }

    // Get the mentioned user
    const mentioned = message.mentions.members.first();
    if (!mentioned) {
        log.action('UNMUTE', `❌ No user mentioned by ${message.author.tag}.`);
        return message.reply('❌ Please mention a user to unmute.');
    }

    // Check if the user is muted
    if (!mentioned.roles.cache.has(MUTED_ROLE)) {
        log.action('UNMUTE', `⚠️ ${message.author.tag} tried to unmute ${mentioned.user.tag}, but they were not muted.`);
        return message.reply('❌ This user is not muted.');
    }

    // Attempt to remove the role
    try {
        // Remove the muted role
        await mentioned.roles.remove(MUTED_ROLE);

        // Disconnect from voice
        if (mentioned.voice.channel) {
            await mentioned.voice.disconnect();
        }

        message.channel.send(`🔊 ${mentioned} has been unmuted.`);
        log.action('UNMUTE', `✅ ${mentioned.user.tag} was unmuted by ${message.author.tag}.`);
    } catch (error) {
        log.error(`❌ Failed to unmute ${mentioned.user.tag}:`, error);
        message.reply('❌ Failed to unmute the user.');
    }
};
