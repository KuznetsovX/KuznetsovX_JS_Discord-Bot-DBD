import { runBackup, syncMembersToDB, updateLastSync } from '../../db/index.js';

export default {
    run: async (message) => {
        try {
            await syncMembersToDB(message.guild);
            await runBackup();
            await updateLastSync();

            await message._send(`🔄 Database has been resynced successfully, and backup has been created.`);
        } catch (error) {
            throw new Error(`Failed to resync the database: ${error.message}`);
        }
    }
};
