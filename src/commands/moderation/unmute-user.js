import config from '../../config/index.js';
import { syncUserToDB } from '../../db/utils/sync-user-to-db.js';

export default {
    run: async (message) => {
        try {
            const mentioned = message.mentions.members.first();

            if (!mentioned) {
                return message._send('❌ Please mention a user to unmute.');
            }

            if (!mentioned.roles.cache.has(config.ROLES.MUTED)) {
                return message._send('❌ User is not muted.');
            }

            await mentioned.roles.remove(config.ROLES.MUTED);
            await syncUserToDB(mentioned);

            const originalChannel = mentioned.voice.channel;
            if (originalChannel) {
                const tempChannel = message.guild.channels.cache.get(config.CHANNELS.TEMPORARY.VOICE);
                if (!tempChannel?.isVoiceBased?.()) {
                    throw new Error(
                        `TEMPORARY_VOICE_CHANNEL ID ${config.CHANNELS.TEMPORARY.VOICE} is invalid or not a voice channel.`
                    );
                }

                await mentioned.voice.setChannel(tempChannel);

                setTimeout(async () => {
                    try {
                        await mentioned.voice.setChannel(originalChannel);
                    } catch (moveBackError) {
                        throw new Error(`Failed to return user to original voice channel: ${moveBackError.message}`);
                    }
                }, 1000);
            }

            return message._send(`🔊 User has been unmuted.`);
        } catch (error) {
            throw new Error(`Failed to unmute user: ${error.message}`);
        }
    }
};
