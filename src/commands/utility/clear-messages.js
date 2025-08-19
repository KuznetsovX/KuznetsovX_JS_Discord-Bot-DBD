import log from '../../utils/logging/log.js';

export default {
    run: async (message) => {
        const args = message.content.trim().split(/\s+/);
        const arg = args[1]?.toLowerCase();

        if (!arg) {
            await message.reply('❌ Please specify how many messages to delete (1-100) or "all".');
            return;
        }

        let limit = 0;
        if (arg === 'all') {
            limit = 100; // max Discord bulkDelete limit
        } else if (!isNaN(arg)) {
            limit = Math.min(parseInt(arg), 100);
        } else {
            await message.reply('❌ Specify a number (1-100) or "all".');
            return;
        }

        try {
            // Always delete the command call itself first
            await message.delete().catch(() => { });

            // Fetch the requested number of *additional* messages
            const fetched = await message.channel.messages.fetch({ limit });
            const deletable = fetched.filter(m => Date.now() - m.createdTimestamp < 14 * 24 * 60 * 60 * 1000);

            if (deletable.size === 0) {
                await message.channel.send('⚠️ No more messages to delete.');
                return;
            }

            await message.channel.bulkDelete(deletable, true);
            await message.channel.send(`🧹 Deleted ${deletable.size} messages.`);
            log.action('CLEAR MESSAGES', `Deleted ${deletable.size} messages by ${message.author.tag}`);
        } catch (e) {
            log.error('❌ Error deleting messages:', e);
            await message.channel.send('❌ Something went wrong.');
        }
    }
};
