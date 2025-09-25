import { EmbedBuilder } from 'discord.js';

/**
 * Returns a prebuilt Invite embed.
 * @param {import('discord.js').Client} client - Discord client instance
 * @returns {EmbedBuilder}
 */
function getInviteEmbed(client) {
    const INVITE = {
        MAIN: {
            name: "**🌟 Main Server Invite**",
            value: [
                "Welcome to our community! 🎉",
                "Main invite link (**valid indefinitely**): https://discord.com/invite/VRR5X8ZdXB",
                "Use this link to invite friends, or if your own link isn't working for any reason."
            ].join("\n")
        },
        TIPS: {
            name: "**💡 Tips**",
            value: [
                "For members already on the server:",
                "• Share this invite link with friends you want to bring in.",
                "",
                "For those, who are seeing this message via forwarding:",
                "• Click the button below to join quickly! 🚀",
                "• Once you join, type `!help` to see available commands."
            ].join("\n")
        }
    };

    return new EmbedBuilder()
        .addFields(INVITE.MAIN, INVITE.TIPS)
        .setColor('Purple')
        .setFooter({
            text: "Invite",
            iconURL: client.user?.displayAvatarURL() || undefined
        })
        .setTimestamp();
}

export default getInviteEmbed;
