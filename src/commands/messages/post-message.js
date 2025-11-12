export default {
    run: async (message) => {
        try {
            // Try to detect mentioned channel
            const mentionedChannel = message.mentions.channels.first();
            const targetChannel = mentionedChannel && mentionedChannel.type === 0
                ? mentionedChannel
                : message.channel; // fallback to same channel

            // Split message into parts
            const split = message.content.trim().split(' ');

            // Detect where actual message content starts
            const contentIndex = mentionedChannel
                ? split.findIndex(word => word.startsWith('<#')) + 1
                : 1; // skip command name itself

            const content = split.slice(contentIndex).join(' ');

            if (!content) {
                return message._send(`❌ You need to provide content to post.`);
            }

            await targetChannel.send(content);

            // Confirm posting if posted to a different channel
            if (targetChannel.id !== message.channel.id) {
                await message._send(`✅ Message successfully posted in ${targetChannel}.`);
            }

        } catch (error) {
            throw new Error(`❌ Failed to post message: ${error instanceof Error ? error.message : error}`);
        }
    }
};
