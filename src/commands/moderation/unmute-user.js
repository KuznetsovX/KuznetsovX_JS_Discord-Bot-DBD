import { ROLES, CHANNELS } from '../../config/index.js';
import { saveRoles } from '../../utils/roles/role-manager.js';

export default {
    run: async (message) => {
        try {
            const mentioned = message.mentions.members.first();

            if (!mentioned) {
                return message._send('❌ Please mention a user to unmute.');
            }

            if (!mentioned.roles.cache.has(ROLES.MUTED.id)) {
                return message._send('❌ User is not muted.');
            }

            await mentioned.roles.remove(ROLES.MUTED.id);
            await saveRoles(mentioned);

            const originalChannel = mentioned.voice.channel;
            if (originalChannel) {
                const tempChannel = message.guild.channels.cache.get(CHANNELS.TEMPORARY.channels.VOICE.id);
                if (!tempChannel?.isVoiceBased?.()) {
                    throw new Error(`TEMPORARY_VOICE_CHANNEL ID ${CHANNELS.TEMPORARY.channels.VOICE.id} is invalid or not a voice channel.`);
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
            throw new Error(`❌ Failed to unmute user: ${error instanceof Error ? error.message : error}`);
        }
    }
};
