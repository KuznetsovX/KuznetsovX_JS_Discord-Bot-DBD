const { ADMIN_ROLE, MUTED_ROLE } = require('../config/roles');
const log = require('../utils/log');

module.exports = async (message) => {
    // Ensure the user has the required role to use the command
    if (!message.member.roles.cache.has(ADMIN_ROLE)) {
        log.action('MUTE', `❌ ${message.author.tag} tried to use !mute without permission.`);
        return message.reply('❌ You do not have permission to use this command.');
    }

    // Ensure a user is mentioned
    const mentioned = message.mentions.members.first();
    if (!mentioned) {
        log.action('MUTE', `❌ No user mentioned by ${message.author.tag}.`);
        return message.reply('❌ Please mention a user to mute.');
    }

    // Check if the mentioned user is already muted
    if (mentioned.roles.cache.has(MUTED_ROLE)) {
        log.action('MUTE', `⚠️ ${message.author.tag} tried to mute ${mentioned.user.tag}, but they were already muted.`);
        return message.reply('⚠️ That user is already muted.');
    }

    // Attempt to mute the user
    try {
        await mentioned.roles.add(MUTED_ROLE);
        message.channel.send(`🔇 ${mentioned} has been muted.`);
        log.action('MUTE', `✅ ${mentioned.user.tag} was muted by ${message.author.tag}.`);
    } catch (error) {
        log.error(`❌ Failed to mute ${mentioned.user.tag}:`, error);
        message.reply('❌ Failed to mute the user.');
    }
};
