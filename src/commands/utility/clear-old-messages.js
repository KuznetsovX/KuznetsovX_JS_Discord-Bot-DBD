const TWO_WEEKS_MS = 14 * 24 * 60 * 60 * 1000;

export default {
    run: async (message) => {
        try {
            const author = message.member;

            const args = message.content.trim().split(/\s+/);
            const arg = args[1]?.toLowerCase();
            if (!arg) {
                return message.channel.send(`❌ ${author}, please specify how many old messages to delete (e.g., \`!clearold 50\`) or use "all".`);
            }

            let limit;
            if (arg === 'all') {
                limit = Infinity;
            } else if (!isNaN(arg)) {
                limit = parseInt(arg, 10);
                if (limit <= 0) return message.channel.send(`❌ ${author}, specify a positive number of messages, or use "all".`);
            } else {
                return message.channel.send(`❌ ${author}, specify a number or "all".`);
            }

            let deleted = 0;
            let lastId = null;

            while (deleted < limit) {
                const options = { limit: 100 };
                if (lastId) options.before = lastId;

                const fetched = await message.channel.messages.fetch(options);
                if (fetched.size === 0) break;

                const oldMessages = fetched.filter(m => Date.now() - m.createdTimestamp >= TWO_WEEKS_MS);
                if (oldMessages.size === 0) break;

                for (const msg of oldMessages.values()) {
                    if (deleted >= limit) break;
                    await msg.delete().catch(() => { });
                    deleted++;
                    await new Promise(r => setTimeout(r, 500));
                }

                lastId = fetched.last()?.id;
            }

            if (deleted > 0) {
                const confirmation = await message.channel.send(`🧹 ${author}, deleted ${deleted} old messages (plus the command call).`);
                setTimeout(() => confirmation.delete().catch(() => { }), 5000);
            } else {
                await message.channel.send(`⚠️ ${author}, no old messages found to delete.`);
            }
        } catch (error) {
            throw new Error(`Failed to delete old messages: ${error.message}`);
        }
    }
};
