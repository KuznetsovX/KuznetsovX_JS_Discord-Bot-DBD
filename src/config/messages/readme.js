import { EmbedBuilder } from 'discord.js';

/**
 * Returns a prebuilt Readme embed.
 * @param {import('discord.js').Client} client - Discord client instance
 * @returns {EmbedBuilder}
 */
function getReadmeEmbed(client) {
    const README = {
        RULES: {
            name: "**📜 Rules**",
            value: [
                "• 🤝 Treat everyone with respect.",
                "• 📢 No spam or self-promotion without staff permission.",
                "• 🔞 No age-restricted or obscene content (text, images, or links).",
            ].join("\n"),
        },
        ROLES: {
            name: "**🎭 Roles**",
            value: [
                "• Click an emoji below to get the corresponding role.",
                "🔔 **: notify me**",
                "⚔️ **: 1v1 enjoyer**",
                "• The role will be added immediately if the bot is online,",
                "or it will be automatically synced once the bot starts if you react while it's offline.",
            ].join("\n"),
        },
        INFORMATION: {
            name: "**ℹ️ Information**",
            value: [
                "• You can also use commands! Type `!help` when the bot is online for more details.",
            ].join("\n"),
        },
    };

    return new EmbedBuilder()
        .addFields(README.RULES, README.ROLES, README.INFORMATION)
        .setColor('Purple')
        .setFooter({
            text: "Readme",
            iconURL: client.user?.displayAvatarURL() || undefined
        })
        .setTimestamp();
}

export default getReadmeEmbed;
