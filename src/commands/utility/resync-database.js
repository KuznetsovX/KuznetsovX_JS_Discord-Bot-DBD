import { syncMembersToDB } from '../../db/index.js';

export default {
    run: async (message) => {
        const author = message.member;

        try {
            await syncMembersToDB(message.guild);
            await message.channel.send(`🔄 ${author}, database has been resynced successfully.`);
        } catch (error) {
            throw new Error(`Failed to resync the database: ${error.message}`);
        }
    }
};
