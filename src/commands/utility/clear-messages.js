function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default {
    run: async (message, args) => {
        try {
            const author = message.member;

            const arg = args?.[0]?.toLowerCase();
            if (!arg) {
                return message.channel.send(`❌ ${author}, please specify how many messages to delete or "all".`);
            }

            let deleteAll = false;
            let target = 0;

            if (arg === 'all') {
                deleteAll = true;
            } else if (!isNaN(arg)) {
                target = Math.max(1, parseInt(arg, 10));
            } else {
                return message.channel.send(`❌ ${author}, specify a number or "all".`);
            }

            let totalDeleted = 0;

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

            if (totalDeleted === 0) {
                return message.channel.send(`⚠️ ${author}, no messages could be deleted. (Discord only bulk-deletes messages newer than 14 days.)`);
            }

            const confirmation = await message.channel.send(`🧹 ${author}, deleted ${totalDeleted} messages.`);
            setTimeout(() => confirmation.delete().catch(() => { }), 5000);
        } catch (error) {
            throw new Error(`Failed to clear messages: ${error.message}`);
        }
    }
};
