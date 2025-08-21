export default {
    run: async (message) => {
        const author = message.member;

        const mentionedChannel = message.mentions.channels.first();
        if (!mentionedChannel || mentionedChannel.type !== 0) {
            return message.channel.send(`❌ ${author}, please mention a valid text channel to post into.`);
        }

        const split = message.content.trim().split(' ');
        const contentIndex = split.findIndex(word => word.startsWith('<#')) + 1;
        const content = split.slice(contentIndex).join(' ');

        if (!content) {
            return message.channel.send(`❌ ${author}, you need to provide content to post after the channel mention.`);
        }

        try {
            await mentionedChannel.send(content);
        } catch (error) {
            throw new Error(`Failed to post message: ${error.message}`);
        }
    }
};
