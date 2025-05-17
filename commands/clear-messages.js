const { ADMIN_ROLE } = require('../config/roles');
const log = require('../utils/log');

module.exports = async (message) => {
    // Ensure the user has the required role to use the command
    if (!message.member.roles.cache.has(ADMIN_ROLE)) {
        log.action('CLEAR MESSAGES', `❌ ${message.author.tag} tried to use !clean without permission.`);
        return message.reply('❌ You do not have permission to use this command.');
    }

    const args = message.content.split(' '); // Split the message to get the number of messages to delete
    const amount = args[1]; // Get the second argument which indicates how many messages to delete

    // Validate if the amount is provided and is either a number or 'all'
    if (!amount || (isNaN(amount) && amount !== 'all')) {
        log.action('CLEAR MESSAGES', `❌ Invalid amount provided by ${message.author.tag}.`);
        return message.reply('❌ Please specify the number of messages to delete or use "all" to delete all messages.');
    }

    // If 'all' is specified, delete messages in bulk until there are no more
    if (amount === 'all') {
        try {
            log.action('CLEAR MESSAGES', `🧹 ${message.author.tag} is deleting all messages.`);

            while (true) {
                const messages = await message.channel.messages.fetch({ limit: 100 }); // Fetch 100 messages at a time
                if (messages.size === 0) break; // Exit if no messages are left
                await message.channel.bulkDelete(messages); // Delete the fetched messages in bulk
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

    // If a specific number of messages is provided, ensure it's valid
    const deleteAmount = parseInt(amount);
    if (deleteAmount > 100 || deleteAmount <= 0) {
        log.action('CLEAR MESSAGES', `❌ Invalid delete amount ${deleteAmount} provided by ${message.author.tag}.`);
        return message.reply('❌ You can only delete between 1 and 100 messages at a time.');
    }

    try {
        log.action('CLEAR MESSAGES', `🧹 ${message.author.tag} is deleting ${deleteAmount} messages.`);

        // Fetch the number of messages specified by the user
        const messagesToDelete = await message.channel.messages.fetch({ limit: deleteAmount });
        await message.channel.bulkDelete(messagesToDelete); // Delete the fetched messages
        message.channel.send(`🧹 Deleted ${deleteAmount} messages.`);
        log.action('CLEAR MESSAGES', `✅ ${deleteAmount} messages deleted by ${message.author.tag}.`);
    } catch (error) {
        log.error(`❌ Error deleting ${deleteAmount} messages by ${message.author.tag}`, error);
        message.reply('❌ Something went wrong while trying to delete the messages.');
    }
};
