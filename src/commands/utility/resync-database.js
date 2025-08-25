import { syncMembersToDB } from '../../db/index.js';
import { updateLastSync } from '../../db/sqlite-meta.js';

export default {
    run: async (message) => {
        try {
            await syncMembersToDB(message.guild);
            await updateLastSync();

            await message._send(`🔄 Database has been resynced successfully.`);
        } catch (error) {
            throw new Error(`Failed to resync the database: ${error.message}`);
        }
    }
};
