import { ROLES } from '../../config/roles.js';
import log from '../../utils/logging/log.js';

export default {
    run: async (message) => {
        // Ensure the user has the required role to use the command
        if (!message.member.roles.cache.has(ROLES.ADMIN)) {
            log.action('BAN USER', `❌ ${message.author.tag} tried to use !ban without permission.`);
            return message.reply('❌ You do not have permission to use this command.');
        }

        const args = message.content.trim().split(/\s+/); // Split the message content to get command arguments
        const mentioned = message.mentions.members.first(); // Get the first mentioned user

        // Helper function to validate if the argument is a valid user ID (snowflake format)
        const isValidSnowflake = (id) => /^\d{17,20}$/.test(id);

        // Ensure a user is mentioned
        if (mentioned) {
            // Check if the bot can ban the mentioned user
            if (!mentioned.bannable) {
                log.action('BAN USER', `❌ Cannot ban ${mentioned.user.tag} — insufficient permissions.`);
                return message.reply('❌ I cannot ban this user. Do I have the right permissions?');
            }

            // Attempt to ban the mentioned user
            try {
                await mentioned.ban();
                message.channel.send(`🔨 ${mentioned} was banned from the server.`);
                log.action('BAN USER', `✅ ${mentioned.user.tag} was banned by ${message.author.tag}.`);
            } catch (error) {
                log.error(`❌ Failed to ban ${mentioned.user.tag}`, error);
                message.reply('❌ Failed to ban the user.');
            }
        } else if (args[1] && isValidSnowflake(args[1])) {
            // If no user is mentioned, check if a valid user ID is provided
            const userId = args[1];

            // Attempt to ban the user by their ID
            try {
                await message.guild.bans.create(userId, {
                    reason: `Banned by ${message.author.tag} via ID`,
                });
                message.channel.send(`🔨 User with ID \`${userId}\` was banned from the server.`);
                log.action('BAN USER', `✅ User with ID ${userId} was banned by ${message.author.tag}.`);
            } catch (error) {
                log.error(`❌ Failed to ban user by ID ${userId}`, error);
                message.reply('❌ Failed to ban the user by ID. Do I have permission, and is the ID valid?');
            }
        } else {
            // If no valid user mention or ID is provided, send an error message
            log.action('BAN USER', `❌ Invalid or missing mention/ID by ${message.author.tag}.`);
            return message.reply('❌ Please mention a user or provide a valid numeric user ID to ban.');
        }
    }
};
