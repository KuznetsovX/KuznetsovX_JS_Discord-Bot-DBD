const { ADMIN_ROLE } = require('../config/roles');
const log = require('../utils/log');

module.exports = async (message) => {
    if (!message.member.roles.cache.has(ADMIN_ROLE)) {
        log.action('KICK', `❌ ${message.author.tag} tried to use !kick without permission.`);
        return message.reply('❌ You do not have permission to use this command.');
    }

    const mentioned = message.mentions.members.first();
    if (!mentioned) {
        log.action('KICK', `❌ No user mentioned by ${message.author.tag}.`);
        return message.reply('❌ Please mention a user to kick.');
    }

    if (!mentioned.kickable) {
        log.action('KICK', `❌ Cannot kick ${mentioned.user.tag} — insufficient permissions.`);
        return message.reply('❌ I cannot kick this user. Do I have the right permissions?');
    }

    try {
        await mentioned.kick();
        message.channel.send(`🚪 ${mentioned} was kicked from the server.`);
        log.action('KICK', `✅ ${mentioned.user.tag} was kicked by ${message.author.tag}.`);
    } catch (error) {
        log.error(`❌ Failed to kick ${mentioned.user.tag}:`, error);
        message.reply('❌ Failed to kick the user.');
    }
};
