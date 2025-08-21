import config from '../../config/index.js';
import { updateUserInDB } from '../../db/utils/update-user-db.js';

export default {
    run: async (message) => {
        const mentioned = message.mentions.members.first();
        if (!mentioned) {
            return message.reply('❌ Please mention a user to unmute.');
        }

        if (!mentioned.roles.cache.has(config.ROLES.MUTED)) {
            return message.reply('❌ This user is not muted.');
        }

        try {
            await mentioned.roles.remove(config.ROLES.MUTED);
            await updateUserInDB(mentioned);

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
                        throw new Error(
                            `Failed to return ${mentioned.user.tag} to original voice channel: ${moveBackError.message}`
                        );
                    }
                }, 1000);
            }

            await message.reply(`🔊 ${mentioned} has been unmuted.`);
        } catch (error) {
            throw new Error(`Failed to unmute ${mentioned.user.tag}: ${error.message}`);
        }
    }
};
