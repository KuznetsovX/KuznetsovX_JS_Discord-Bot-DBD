const { TEMPORARY_VOICE_CHANNEL } = require('../config/channels');
const { ADMIN_ROLE, MUTED_ROLE } = require('../config/roles');
const log = require('../utils/log');
const updateUserInDB = require('../utils/update-user-db');

module.exports = {
    run: async (message) => {
        // Check if the command author has the admin role
        if (!message.member.roles.cache.has(ADMIN_ROLE)) {
            log.action('UNMUTE', `❌ ${message.author.tag} tried to use !unmute without permission.`);
            return message.reply('❌ You do not have permission to use this command.');
        }

        // Get the first mentioned member
        const mentioned = message.mentions.members.first();
        if (!mentioned) {
            log.action('UNMUTE', `❌ No user mentioned by ${message.author.tag}.`);
            return message.reply('❌ Please mention a user to unmute.');
        }

        // Check if the user is actually muted
        if (!mentioned.roles.cache.has(MUTED_ROLE)) {
            log.action('UNMUTE', `⚠️ ${message.author.tag} tried to unmute ${mentioned.user.tag}, but they were not muted.`);
            return message.reply('❌ This user is not muted.');
        }

        try {
            // Remove the muted role
            await mentioned.roles.remove(MUTED_ROLE);
            await updateUserInDB(mentioned);

            // If the user is in a voice channel, move them to TEMP then back
            const originalChannel = mentioned.voice.channel;
            if (originalChannel) {
                const tempChannel = message.guild.channels.cache.get(TEMPORARY_VOICE_CHANNEL);

                // Validate that the temporary channel exists and is a voice channel
                if (!tempChannel?.isVoiceBased?.()) {
                    log.error(`❌ TEMPORARY_VOICE_CHANNEL ID ${TEMPORARY_VOICE_CHANNEL} is invalid or not a voice channel.`);
                } else {
                    // Move to temp channel
                    await mentioned.voice.setChannel(tempChannel);

                    // Return to original voice channel after a short delay
                    setTimeout(async () => {
                        try {
                            await mentioned.voice.setChannel(originalChannel);
                        } catch (moveBackError) {
                            log.error(`❌ Failed to return ${mentioned.user.tag} to original voice channel:`, moveBackError);
                        }
                    }, 1000); // Delay in milliseconds (1 second)
                }
            }

            // Final feedback and logging
            message.channel.send(`🔊 ${mentioned} has been unmuted.`);
            log.action('UNMUTE', `✅ ${mentioned.user.tag} was unmuted by ${message.author.tag}.`);
        } catch (error) {
            log.error(`❌ Failed to unmute ${mentioned.user.tag}:`, error);
            message.reply('❌ Failed to unmute the user.');
        }
    }
};
