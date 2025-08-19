import log from '../../utils/logging/log.js';

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

export default {
    run: async (message, args) => {
        const arg = args?.[0]?.toLowerCase();

        if (!arg) {
            await message.reply('❌ Please specify how many messages to delete or "all".');
            return;
        }

        // Remove the invoking command so it isn't counted in the deletion
        await message.delete().catch(() => { });

        let deleteAll = false;
        let target = 0;

        if (arg === 'all') {
            deleteAll = true;
        } else if (!isNaN(arg)) {
            target = Math.max(1, parseInt(arg, 10));
        } else {
            await message.channel.send('❌ Specify a number or "all".');
            return;
        }

        let totalDeleted = 0;

        try {
            if (deleteAll) {
                // keep deleting batches of 100 until none are left (<14 days only)
                while (true) {
                    const deleted = await message.channel.bulkDelete(100, true);
                    const count = deleted.size;
                    if (count === 0) break;
                    totalDeleted += count;
                    // small pause to play nice with rate limits
                    await sleep(900);
                }
            } else {
                // delete up to `target` messages, in chunks of 100
                let remaining = target;
                while (remaining > 0) {
                    const chunk = Math.min(remaining, 100);
                    const deleted = await message.channel.bulkDelete(chunk, true);
                    const count = deleted.size;
                    if (count === 0) break; // nothing else deletable (likely >14 days)
                    totalDeleted += count;
                    remaining -= count;
                    await sleep(900);
                }
            }

            if (totalDeleted === 0) {
                await message.channel.send('⚠️ No messages could be deleted. (Discord only bulk-deletes messages newer than 14 days.)');
                return;
            }

            const confirmation = await message.channel.send(`🧹 Deleted ${totalDeleted} messages.`);
            setTimeout(() => confirmation.delete().catch(() => { }), 5000);

            log.action('CLEAR MESSAGES', `Deleted ${totalDeleted} messages by ${message.author.tag}`);
        } catch (e) {
            log.error('❌ Error deleting messages:', e);
            await message.channel.send('❌ Something went wrong.');
        }
    }
};
