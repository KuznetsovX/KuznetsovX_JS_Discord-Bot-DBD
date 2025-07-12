const { ADMIN_ROLE } = require('../config/roles');
const log = require('../utils/log');

module.exports = async (message) => {
    if (!message.member.roles.cache.has(ADMIN_ROLE)) {
        log.action('CLEAR MESSAGES', `❌ ${message.author.tag} tried to use !clear without permission.`);
        return message.reply('❌ You do not have permission to use this command.');
    }

    const args = message.content.trim().split(/\s+/);
    const amount = args[1];

    if (!amount || (isNaN(amount) && amount !== 'all')) {
        log.action('CLEAR MESSAGES', `❌ Invalid amount provided by ${message.author.tag}.`);
        return message.reply('❌ Please specify the number of messages to delete (1–100) or use "all".');
    }

    if (amount === 'all') {
        try {
            log.action('CLEAR MESSAGES', `🧹 ${message.author.tag} is deleting all recent messages.`);

            while (true) {
                const fetched = await message.channel.messages.fetch({ limit: 100 });
                if (fetched.size === 0) break;

                const deletable = fetched.filter(m => Date.now() - m.createdTimestamp < 14 * 24 * 60 * 60 * 1000);
                if (deletable.size === 0) break;

                await message.channel.bulkDelete(deletable, true);
                log.action('CLEAR MESSAGES', `✅ Bulk deleted ${deletable.size} messages.`);
            }

            message.channel.send('🧹 Finished deleting all **recent** messages (under 14 days).');
            log.action('CLEAR MESSAGES', `✅ All recent messages deleted by ${message.author.tag}.`);
        } catch (error) {
            log.error(`❌ Error during !clean all by ${message.author.tag}`, error);
            message.reply('❌ Something went wrong while trying to delete messages.');
        }
        return;
    }

    const deleteAmount = parseInt(amount);
    if (deleteAmount > 100 || deleteAmount <= 0) {
        log.action('CLEAR MESSAGES', `❌ Invalid delete amount ${deleteAmount} by ${message.author.tag}.`);
        return message.reply('❌ You can only delete between 1 and 100 messages at a time.');
    }

    try {
        const fetched = await message.channel.messages.fetch({ limit: deleteAmount });
        const deletable = fetched.filter(m => Date.now() - m.createdTimestamp < 14 * 24 * 60 * 60 * 1000);

        await message.channel.bulkDelete(deletable, true);
        log.action('CLEAR MESSAGES', `✅ Deleted ${deletable.size} of ${fetched.size} requested messages.`);

        if (deletable.size < fetched.size) {
            message.channel.send(`⚠️ Only deleted ${deletable.size} messages — some were too old.`);
        } else {
            message.channel.send(`🧹 Deleted ${deletable.size} messages.`);
        }
    } catch (error) {
        log.error(`❌ Error deleting ${amount} messages by ${message.author.tag}`, error);
        message.reply('❌ Something went wrong while trying to delete messages.');
    }
};
