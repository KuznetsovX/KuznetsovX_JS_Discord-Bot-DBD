const { ADMIN_ROLE } = require('../config/roles');
const log = require('../utils/log');

module.exports = async (message) => {
    if (!message.member.roles.cache.has(ADMIN_ROLE)) {
        log.action('CLEAR MESSAGES', `❌ ${message.author.tag} tried to use !clean without permission.`);
        return message.reply('❌ You do not have permission to use this command.');
    }

    const args = message.content.split(' ');
    const amount = args[1];

    if (!amount || (isNaN(amount) && amount !== 'all')) {
        log.action('CLEAR MESSAGES', `❌ Invalid amount provided by ${message.author.tag}.`);
        return message.reply('❌ Please specify the number of messages to delete or use "all" to delete all messages.');
    }

    if (amount === 'all') {
        try {
            log.action('CLEAR MESSAGES', `🧹 ${message.author.tag} is deleting all messages.`);

            while (true) {
                const messages = await message.channel.messages.fetch({ limit: 100 });
                if (messages.size === 0) break;
                await message.channel.bulkDelete(messages);
                log.action('CLEAR MESSAGES', `✅ Deleted ${messages.size} messages.`);
            }

            message.channel.send('🧹 All messages have been deleted.');
            log.action('CLEAR MESSAGES', `✅ All messages deleted by ${message.author.tag}.`);
        } catch (error) {
            log.error(`❌ Error deleting all messages by ${message.author.tag}`, error);
            message.reply('❌ Something went wrong while trying to delete the messages.');
        }
        return;
    }

    const deleteAmount = parseInt(amount);
    if (deleteAmount > 100 || deleteAmount <= 0) {
        log.action('CLEAR MESSAGES', `❌ Invalid delete amount ${deleteAmount} provided by ${message.author.tag}.`);
        return message.reply('❌ You can only delete between 1 and 100 messages at a time.');
    }

    try {
        log.action('CLEAR MESSAGES', `🧹 ${message.author.tag} is deleting ${deleteAmount} messages.`);

        const messagesToDelete = await message.channel.messages.fetch({ limit: deleteAmount });
        await message.channel.bulkDelete(messagesToDelete);
        message.channel.send(`🧹 Deleted ${deleteAmount} messages.`);
        log.action('CLEAR MESSAGES', `✅ ${deleteAmount} messages deleted by ${message.author.tag}.`);
    } catch (error) {
        log.error(`❌ Error deleting ${deleteAmount} messages by ${message.author.tag}`, error);
        message.reply('❌ Something went wrong while trying to delete the messages.');
    }
};
