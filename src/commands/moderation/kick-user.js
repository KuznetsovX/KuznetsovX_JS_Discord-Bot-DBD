export default {
    run: async (message) => {
        const mentioned = message.mentions.members.first();
        if (!mentioned) {
            return message.reply('❌ Please mention a user to kick.');
        }

        if (!mentioned.kickable) {
            return message.reply('❌ I cannot kick this user. Do I have the right permissions?');
        }

        try {
            await mentioned.kick();
            await message.reply(`🚪 ${mentioned} was kicked from the server.`);
        } catch (error) {
            throw new Error(`Failed to kick ${mentioned.user.tag}: ${error.message}`);
        }
    }
};
