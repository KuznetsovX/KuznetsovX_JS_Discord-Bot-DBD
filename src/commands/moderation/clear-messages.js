const TWO_WEEKS_MS = 14 * 24 * 60 * 60 * 1000;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default {
    run: async (message, args) => {
        try {
            const arg = args?.[0]?.toLowerCase();
            if (!arg) return message._send(`❌ Please specify how many messages to delete or "all".`);

            let deleteAll = false;
            let target = 0;

            if (arg === 'all') {
                deleteAll = true;
            } else if (!isNaN(arg)) {
                target = Math.max(1, parseInt(arg, 10));
            } else {
                return message._send(`❌ Specify a number or "all".`);
            }

            let totalDeleted = 0;

            // Step 1: Try normal bulk delete
            if (deleteAll) {
                while (true) {
                    const deleted = await message.channel.bulkDelete(100, true);
                    if (deleted.size === 0) break;
                    totalDeleted += deleted.size;
                    await sleep(900);
                }
            } else {
                let remaining = target;
                while (remaining > 0) {
                    const chunk = Math.min(remaining, 100);
                    const deleted = await message.channel.bulkDelete(chunk, true);
                    if (deleted.size === 0) break;
                    totalDeleted += deleted.size;
                    remaining -= deleted.size;
                    await sleep(900);
                }
            }

            // Step 2: If some messages couldn't be deleted, delete old messages manually
            let leftover = deleteAll ? Infinity : (target - totalDeleted);
            if (leftover > 0) {
                let deletedOld = 0;
                let lastId = null;

                while (deletedOld < leftover) {
                    const options = { limit: 100 };
                    if (lastId) options.before = lastId;

                    const fetched = await message.channel.messages.fetch(options);
                    if (fetched.size === 0) break;

                    const oldMessages = fetched.filter(m => Date.now() - m.createdTimestamp >= TWO_WEEKS_MS);
                    if (oldMessages.size === 0) break;

                    for (const msg of oldMessages.values()) {
                        if (deletedOld >= leftover) break;
                        await msg.delete().catch(() => { });
                        deletedOld++;
                        await sleep(500);
                    }

                    lastId = fetched.last()?.id;
                }

                totalDeleted += deletedOld;
            }

            if (totalDeleted === 0) {
                return message._send(`⚠️ No messages could be deleted.`);
            }

            const confirmation = await message._send(`🧹 Deleted ${totalDeleted} messages.`);
            setTimeout(() => confirmation.delete().catch(() => { }), 5000);

        } catch (error) {
            throw new Error(`❌ Failed to clear messages: ${error instanceof Error ? error.message : error}`);
        }
    }
};
