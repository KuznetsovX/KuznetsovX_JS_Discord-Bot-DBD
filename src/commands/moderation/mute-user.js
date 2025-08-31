import { ROLES, CHANNELS } from '../../config/index.js';
import { saveRoles } from '../../utils/roles/role-manager.js';

export default {
    run: async (message) => {
        try {
            const mentioned = message.mentions.members.first();

            if (!mentioned) {
                return message._send('❌ Please mention a user to mute.');
            }

            if (mentioned.user.bot || mentioned.roles.cache.has(ROLES.ADMIN.id) || mentioned.roles.cache.has(ROLES.MODERATOR.id)) {
                return message._send('⚠️ Cannot mute admins, moderators or bots.');
            }

            if (mentioned.roles.cache.has(ROLES.MUTED.id)) {
                return message._send('⚠️ User is already muted.');
            }

            await mentioned.roles.add(ROLES.MUTED.id);
            await saveRoles(mentioned);

            const originalChannel = mentioned.voice.channel;
            if (originalChannel) {
                const tempChannel = message.guild.channels.cache.get(CHANNELS.TEMPORARY_VOICE.id);
                if (!tempChannel?.isVoiceBased?.()) {
                    throw new Error(`TEMPORARY_VOICE_CHANNEL ID ${CHANNELS.TEMPORARY_VOICE.id} is invalid or not a voice channel.`);
                }

                await mentioned.voice.setChannel(tempChannel);

                setTimeout(async () => {
                    try {
                        await mentioned.voice.setChannel(originalChannel);
                    } catch (err) {
                        throw new Error(`Failed to return user to original voice channel: ${err.message}`);
                    }
                }, 1000);
            }

            return message._send(`🔇 User has been muted.`);
        } catch (error) {
            throw new Error(`Failed to mute user: ${error.message}`);
        }
    }
};
