import { EmbedBuilder } from 'discord.js';

/**
 * Returns a prebuilt Readme embed.
 * @param {import('discord.js').Client} client - Discord client instance
 * @returns {EmbedBuilder}
 */
function getReadmeEmbed(client) {
    const README = {
        RULES_TEXT: [
            "• Treat everyone with respect.",
            "• No spam or self-promotion without staff permission.",
            "• No age-restricted or obscene content (text, images, or links)."
        ],
        ROLES_TEXT: [
            "Click an emoji below to get the corresponding role.",
            "The role will be added immediately if the bot is online,",
            "or it will be automatically synced once the bot starts if you react while it's offline.",
            "",
            "🔔 : notify me",
            "⚔️ : 1v1 enjoyer",
            "",
            "Alternatively, you can use commands. Type `!help` when the bot is online to get more information."
        ]
    };

    const RULES_TEXT = README.RULES_TEXT.join("\n");
    const ROLES_TEXT = README.ROLES_TEXT.join("\n");

    return new EmbedBuilder()
        .setAuthor({
            name: "DBD.exe",
            url: "https://discord.com/invite/VRR5X8ZdXB",
        })
        .addFields(
            { name: "Rules", value: RULES_TEXT },
            { name: "Roles", value: ROLES_TEXT }
        )
        .setColor('Purple')
        .setFooter({
            text: "Readme",
            iconURL: client.user?.displayAvatarURL() || undefined
        })
        .setTimestamp();
}

export default getReadmeEmbed;
