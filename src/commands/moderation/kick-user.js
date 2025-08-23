export default {
    run: async (message) => {
        try {
            const mentioned = message.mentions.members.first();

            if (!mentioned) {
                return message.reply('❌ Please mention a user to kick.');
            }

            if (!mentioned.kickable) {
                return message.reply('❌ I cannot kick this user.');
            }

            await mentioned.kick({ reason: `Kicked by ${message.author.tag}` });
            return message.reply(`🚪 User was kicked from the server.`);
        } catch (error) {
            throw new Error(`Failed to kick user: ${error.message}`);
        }
    }
};
