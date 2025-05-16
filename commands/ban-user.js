const { ADMIN_ROLE } = require('../config/roles');
const log = require('../utils/log');

module.exports = async (message) => {
    if (!message.member.roles.cache.has(ADMIN_ROLE)) {
        log.action('BAN', `❌ ${message.author.tag} tried to use !ban without permission.`);
        return message.reply('❌ You do not have permission to use this command.');
    }

    const args = message.content.trim().split(/\s+/);
    const mentioned = message.mentions.members.first();

    const isValidSnowflake = (id) => /^\d{17,20}$/.test(id);

    if (mentioned) {
        if (!mentioned.bannable) {
            log.action('BAN', `❌ Cannot ban ${mentioned.user.tag} — insufficient permissions.`);
            return message.reply('❌ I cannot ban this user. Do I have the right permissions?');
        }

        try {
            await mentioned.ban();
            message.channel.send(`🔨 ${mentioned} was banned from the server.`);
            log.action('BAN', `✅ ${mentioned.user.tag} was banned by ${message.author.tag}.`);
        } catch (error) {
            log.error(`❌ Failed to ban ${mentioned.user.tag}`, error);
            message.reply('❌ Failed to ban the user.');
        }
    } else if (args[1] && isValidSnowflake(args[1])) {
        const userId = args[1];

        try {
            await message.guild.bans.create(userId, {
                reason: `Banned by ${message.author.tag} via ID`,
            });
            message.channel.send(`🔨 User with ID \`${userId}\` was banned from the server.`);
            log.action('BAN', `✅ User with ID ${userId} was banned by ${message.author.tag}.`);
        } catch (error) {
            log.error(`❌ Failed to ban user by ID ${userId}`, error);
            message.reply('❌ Failed to ban the user by ID. Do I have permission, and is the ID valid?');
        }
    } else {
        log.action('BAN', `❌ Invalid or missing mention/ID by ${message.author.tag}.`);
        return message.reply('❌ Please mention a user or provide a valid numeric user ID to ban.');
    }
};
