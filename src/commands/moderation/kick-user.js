export default {
    run: async (message) => {
        try {
            const mentioned = message.mentions.members.first();

            if (!mentioned) {
                return message._send('❌ Please mention a user to kick.');
            }

            if (!mentioned.kickable) {
                return message._send('❌ I cannot kick this user.');
            }

            await mentioned.kick({ reason: `Kicked by ${message.author.tag}` });
            return message._send(`🚪 User was kicked from the server.`);
        } catch (error) {
            throw new Error(`Failed to kick user: ${error.message}`);
        }
    }
};
