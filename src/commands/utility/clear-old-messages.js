import { ADMIN_ROLE } from '../../config/roles.js';
import log from '../../utils/logging/log.js';
import clearMessages from './clear-messages.js';

export default {
    run: async (message, limitArg) => {
        if (!message.member.roles.cache.has(ADMIN_ROLE)) {
            await message.reply('❌ You do not have permission to use this command.');
            log.action('CLEAR OLD MESSAGES', `❌ ${message.author.tag} tried to use the command without permission.`);
            return;
        }

        const limit = limitArg ?? Infinity;
        let deleted = 0;
        let lastId = null;

        try {
            log.action('CLEAR OLD MESSAGES', `🧹 ${message.author.tag} started deleting old messages.`);

            while (true) {
                const options = { limit: 100 };
                if (lastId) options.before = lastId;

                const fetched = await message.channel.messages.fetch(options);
                if (fetched.size === 0) break;

                const oldMessages = fetched.filter(m => Date.now() - m.createdTimestamp >= 14 * 24 * 60 * 60 * 1000);

                if (oldMessages.size === 0) {
                    log.action('CLEAR OLD MESSAGES', `No old messages found, calling clear-messages instead.`);
                    await clearMessages.run(message, 'all'); // fallback to deleting recent messages
                    return;
                }

                for (const msg of oldMessages.values()) {
                    if (deleted >= limit) break;

                    try {
                        await msg.delete();
                        deleted++;
                        await new Promise(r => setTimeout(r, 500)); // rate limit safety
                    } catch (e) {
                        log.error('❌ Failed to delete old message:', e);
                    }
                }

                lastId = fetched.last()?.id;
                if (deleted >= limit) break;
            }

            if (deleted > 0) {
                await message.channel.send(`🧹 Deleted ${deleted} old messages (over 14 days old).`);
                log.action('CLEAR OLD MESSAGES', `✅ Deleted ${deleted} old messages by ${message.author.tag}`);
            }
        } catch (error) {
            log.error('❌ Error deleting old messages:', error);
            await message.reply('❌ Something went wrong while deleting old messages.');
        }

        return deleted;
    }
};
