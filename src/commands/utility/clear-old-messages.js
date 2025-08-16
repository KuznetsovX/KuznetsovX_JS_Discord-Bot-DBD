import { ADMIN_ROLE } from '../../config/roles.js';
import log from '../../utils/logging/log.js';

const TWO_WEEKS_MS = 14 * 24 * 60 * 60 * 1000;

export default {
    run: async (message) => {
        if (!message.member.roles.cache.has(ADMIN_ROLE)) {
            await message.reply('❌ You do not have permission.');
            return;
        }

        const args = message.content.trim().split(/\s+/);
        const arg = args[1]?.toLowerCase();

        if (!arg) {
            await message.reply('❌ Please specify how many old messages to delete (e.g. `!clearold 50`) or use "all".');
            return;
        }

        let limit;
        if (arg === 'all') {
            limit = Infinity;
        } else if (!isNaN(arg)) {
            limit = parseInt(arg, 10);
            if (limit <= 0) {
                await message.reply('❌ Specify a positive number of messages, or use "all".');
                return;
            }
        } else {
            await message.reply('❌ Specify a number (e.g. `!clearold 50`) or "all".');
            return;
        }

        try {
            // Delete the command message itself first
            await message.delete().catch(() => { });

            let deleted = 0;
            let lastId = null;

            log.action('CLEAR OLD MESSAGES', `🧹 ${message.author.tag} started deleting old messages.`);

            while (deleted < limit) {
                const options = { limit: 100 };
                if (lastId) options.before = lastId;

                const fetched = await message.channel.messages.fetch(options);
                if (fetched.size === 0) break;

                const oldMessages = fetched.filter(
                    m => Date.now() - m.createdTimestamp >= TWO_WEEKS_MS
                );

                if (oldMessages.size === 0) break;

                for (const msg of oldMessages.values()) {
                    if (deleted >= limit) break;
                    try {
                        await msg.delete();
                        deleted++;
                        await new Promise(r => setTimeout(r, 500)); // avoid rate limits
                    } catch (e) {
                        log.error('❌ Failed to delete old message:', e);
                    }
                }

                lastId = fetched.last()?.id;
            }

            if (deleted > 0) {
                await message.channel.send(`🧹 Deleted ${deleted} old messages (plus the command call).`);
                log.action('CLEAR OLD MESSAGES', `✅ Deleted ${deleted} old messages by ${message.author.tag}`);
            } else {
                await message.channel.send('⚠️ No old messages found to delete.');
            }
        } catch (error) {
            log.error('❌ Error deleting old messages:', error);
            await message.channel.send('❌ Something went wrong while deleting old messages.');
        }
    }
};
