import { ADMIN_ROLE } from '../config/roles.js';
import log from '../utils/log.js';

export default {
    run: async (message) => {
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

                // Send a status message (won't be deleted)
                const statusMsg = await message.channel.send('🧹 Starting cleanup of recent messages...');

                let totalDeleted = 0;

                while (true) {
                    const fetched = await message.channel.messages.fetch({ limit: 100 });

                    // Remove status message
                    const deletable = fetched.filter(m =>
                        m.id !== statusMsg.id &&
                        Date.now() - m.createdTimestamp < 14 * 24 * 60 * 60 * 1000
                    );

                    // Skip if empty
                    if (deletable.size === 0) break;

                    try {
                        const deleted = await message.channel.bulkDelete(deletable, true);
                        totalDeleted += deleted.size;
                        log.action('CLEAR MESSAGES', `✅ Bulk deleted ${deleted.size} messages.`);
                    } catch (bulkError) {
                        // If something failed, skip this batch
                        log.error('❌ Error during bulk delete:', bulkError);
                        break;
                    }
                }

                // Edit status message to show completion
                await statusMsg.edit(`🧹 Finished deleting **${totalDeleted}** recent messages (under 14 days).`);
                log.action('CLEAR MESSAGES', `✅ Total ${totalDeleted} messages deleted by ${message.author.tag}.`);
            } catch (error) {
                log.error(`❌ Error during !clean all by ${message.author.tag}`, error);
                try {
                    await message.channel.send('❌ Something went wrong while trying to delete messages.');
                } catch (sendError) {
                    log.error('❌ Failed to send error message to channel.', sendError);
                }
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
    }
};
