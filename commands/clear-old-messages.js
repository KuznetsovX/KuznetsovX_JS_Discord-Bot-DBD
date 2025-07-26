const { ADMIN_ROLE } = require('../config/roles');
const log = require('../utils/log');

module.exports = {
    run: async (message) => {
        if (!message.member.roles.cache.has(ADMIN_ROLE)) {
            log.action('CLEAR OLD', `❌ ${message.author.tag} tried to use !clearold without permission.`);
            return message.reply('❌ You do not have permission to use this command.');
        }

        const args = message.content.trim().split(/\s+/);
        const amount = args[1];

        if (!amount || (isNaN(amount) && amount !== 'all')) {
            return message.reply('❌ Please specify a number or use "all". Example: `!clearold 100` or `!clearold all`');
        }

        const deleteOldMessagesSlowly = async (limit) => {
            let deleted = 0;
            let fetchMore = true;
            let lastId = null;

            while (fetchMore) {
                const options = { limit: 100 };
                if (lastId) options.before = lastId;

                const messages = await message.channel.messages.fetch(options);
                if (messages.size === 0) break;

                const recent = messages.filter(m => Date.now() - m.createdTimestamp < 14 * 24 * 60 * 60 * 1000);
                const old = messages.filter(m => Date.now() - m.createdTimestamp >= 14 * 24 * 60 * 60 * 1000);

                if (recent.size > 0) {
                    try {
                        await message.channel.bulkDelete(recent, true);
                        deleted += recent.size;
                    } catch (e) {
                        log.error('❌ Bulk delete failed:', e);
                    }
                }

                for (const msg of old.values()) {
                    try {
                        await msg.delete();
                        deleted++;
                        await new Promise(r => setTimeout(r, 500)); // 500ms delay between deletes
                    } catch (e) {

                    }
                }

                lastId = messages.last().id;

                if (amount !== 'all' && deleted >= parseInt(amount)) {
                    fetchMore = false;
                }
            }

            return deleted;
        };

        try {
            const toDelete = amount === 'all' ? Infinity : parseInt(amount);
            log.action('CLEAR OLD', `🧹 ${message.author.tag} started deleting messages with !clearold ${amount}.`);

            const deletedCount = await deleteOldMessagesSlowly(toDelete);

            await message.channel.send(`🧹 Deleted ${deletedCount} messages (including old ones).`);
            log.action('CLEAR OLD', `✅ ${message.author.tag} finished deleting ${deletedCount} messages.`);
        } catch (error) {
            log.error(`❌ Error deleting messages by ${message.author.tag}`, error);
            message.reply('❌ Something went wrong while deleting messages.');
        }
    }
};
