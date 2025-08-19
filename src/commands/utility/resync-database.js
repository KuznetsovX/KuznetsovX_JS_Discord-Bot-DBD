import { syncMembersToDB } from '../../db/index.js';
import log from '../../utils/logging/log.js';

export default {
    run: async (message) => {
        try {
            await syncMembersToDB(message.guild);

            message.channel.send('🔄 Database has been resynced successfully.');
            log.action('RESYNC DATABASE', `✅ ${message.author.tag} manually resynced the database.`);
        } catch (error) {
            log.error(`❌ Failed to resync database:`, error);
            message.reply('❌ Failed to resync the database.');
        }
    }
};
