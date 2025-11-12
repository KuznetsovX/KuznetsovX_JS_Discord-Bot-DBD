import { runBackup, syncMembersToDB, updateLastSync } from '../../database/index.js';

export default {
    run: async (message) => {
        try {
            await syncMembersToDB(message.guild);
            await runBackup();
            await updateLastSync();

            await message._send(`🔄 Database has been resynced successfully, and backup has been created.`);
        } catch (error) {
            throw new Error(`❌ Failed to resync database: ${error instanceof Error ? error.message : error}`);
        }
    }
};
