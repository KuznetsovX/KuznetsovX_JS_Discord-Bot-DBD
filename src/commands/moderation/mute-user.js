import { CHANNELS } from '../../config/channels.js';
import { ROLES } from '../../config/roles.js';
import log from '../../utils/logging/log.js';
import { updateUserInDB } from '../../db/utils/update-user-db.js';

export default {
    run: async (message) => {
        // Check if the command author has the admin role
        if (!message.member.roles.cache.has(ROLES.ADMIN)) {
            log.action('MUTE USER', `❌ ${message.author.tag} tried to use !mute without permission.`);
            return message.reply('❌ You do not have permission to use this command.');
        }

        // Get the first mentioned member
        const mentioned = message.mentions.members.first();
        if (!mentioned) {
            log.action('MUTE USER', `❌ No user mentioned by ${message.author.tag}.`);
            return message.reply('❌ Please mention a user to mute.');
        }

        // Prevent muting bots or fellow admins
        if (mentioned.user.bot || mentioned.roles.cache.has(ROLES.ADMIN)) {
            log.action('MUTE USER', `⚠️ ${message.author.tag} tried to mute ${mentioned.user.tag}.`);
            return message.reply('⚠️ Cannot mute admins or bots.');
        }

        // Prevent re-muting already muted users
        if (mentioned.roles.cache.has(ROLES.MUTED)) {
            log.action('MUTE USER', `⚠️ ${message.author.tag} tried to mute ${mentioned.user.tag}, but they were already muted.`);
            return message.reply('⚠️ That user is already muted.');
        }

        try {
            // Add the muted role to the user
            await mentioned.roles.add(ROLES.MUTED);
            await updateUserInDB(mentioned);

            // If the user is in a voice channel, move them to TEMP then back
            const originalChannel = mentioned.voice.channel;
            if (originalChannel) {
                const tempChannel = message.guild.channels.cache.get(CHANNELS.TEMPORARY.VOICE);

                // Validate that the temporary channel exists and is a voice channel
                if (!tempChannel?.isVoiceBased?.()) {
                    log.error(`❌ TEMPORARY_VOICE_CHANNEL ID ${CHANNELS.TEMPORARY.VOICE} is invalid or not a voice channel.`);
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
            message.channel.send(`🔇 ${mentioned} has been muted.`);
            log.action('MUTE USER', `✅ ${mentioned.user.tag} was muted by ${message.author.tag}.`);
        } catch (error) {
            log.error(`❌ Failed to mute/move ${mentioned.user.tag}:`, error);
            message.reply('❌ Failed to mute the user.');
        }
    }
};
