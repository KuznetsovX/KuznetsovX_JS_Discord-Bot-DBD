import { removeUserFromDB } from '../../database/index.js';

export default {
    run: async (message) => {
        try {
            const args = message.content.trim().split(/\s+/);
            const mentioned = message.mentions.members.first();

            const isValidSnowflake = (id) => /^\d{17,20}$/.test(id);

            if (mentioned) {
                if (!mentioned.bannable) {
                    return message._send('❌ I cannot ban this user.');
                }

                await mentioned.ban({ reason: `Banned by ${message.author.tag}` });
                await removeUserFromDB(mentioned);
                return message._send(`🔨 User was banned from the server.`);
            }

            if (args[1] && isValidSnowflake(args[1])) {
                const userId = args[1];
                await message.guild.bans.create(userId, { reason: `Banned by ${message.author.tag}` });
                await removeUserFromDB(userId);
                return message._send(`🔨 User was banned from the server.`);
            }

            return message._send('❌ Please mention a user or provide a valid numeric user ID to ban.');
        } catch (error) {
            throw new Error(`❌ Failed to ban user: ${error instanceof Error ? error.message : error}`);
        }
    }
};
