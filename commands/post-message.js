const { ADMIN_ROLE } = require('../config/roles');
const log = require('../utils/log');

module.exports = {
    run: async (message) => {
        const authorTag = message.author.tag;

        // Check if the command author has the admin role
        if (!message.member.roles.cache.has(ADMIN_ROLE)) {
            log.action('POST', `❌ ${authorTag} tried to use !post without permission.`);
            return message.reply('❌ You do not have permission to use this command.');
        }

        // Check for a mentioned channel
        const mentionedChannel = message.mentions.channels.first();
        if (!mentionedChannel || mentionedChannel.type !== 0) { // type 0 = GUILD_TEXT
            return message.reply('❌ Please mention a valid text channel to post into.');
        }

        // Extract content after the channel mention
        const split = message.content.trim().split(' ');
        const contentIndex = split.findIndex(word => word.startsWith('<#')) + 1;
        const content = split.slice(contentIndex).join(' ');

        // Ensure the message has content
        if (!content) {
            log.action('POST', `❌ ${authorTag} used !post without content after the channel mention.`);
            return message.reply('❌ You need to provide content to post after the channel mention.');
        }

        // Attempt to send message
        try {
            await mentionedChannel.send(content);
            await message.delete();
            log.action('POST', `✅ ${authorTag} posted to #${mentionedChannel.name}: ${content}`);
        } catch (error) {
            log.error(`❌ Failed to post message from ${authorTag}:`, error);
            await message.reply('❌ Something went wrong while posting your message.');
        }
    }
};
