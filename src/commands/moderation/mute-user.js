import config from '../../config/index.js';
import { syncUserToDB } from '../../db/utils/sync-user-to-db.js';

export default {
    run: async (message) => {
        const mentioned = message.mentions.members.first();
        if (!mentioned) {
            return message.reply('❌ Please mention a user to mute.');
        }

        if (mentioned.user.bot || mentioned.roles.cache.has(config.ROLES.ADMIN)) {
            return message.reply('⚠️ Cannot mute admins or bots.');
        }

        if (mentioned.roles.cache.has(config.ROLES.MUTED)) {
            return message.reply('⚠️ That user is already muted.');
        }

        try {
            await mentioned.roles.add(config.ROLES.MUTED);
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
                    } catch (err) {
                        throw new Error(`Failed to return ${mentioned.user.tag} to original channel: ${err.message}`);
                    }
                }, 1000);
            }

            await message.reply(`🔇 ${mentioned} has been muted.`);
        } catch (error) {
            throw new Error(`Failed to mute ${mentioned.user.tag}: ${error.message}`);
        }
    }
};
