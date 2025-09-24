import { EmbedBuilder } from 'discord.js';

const README = {
    RULES_TEXT: [
        "• Treat everyone with respect.",
        "• No spam or self-promotion without staff permission.",
        "• No age-restricted or obscene content (text, images, or links)."
    ],
    ROLES_TEXT: [
        "Click emoji below to get a corresponding role **(requires bot to be online)**:",
        "🔔 Notifications",
        "",
        "Alternatively, use commands. Type `!help` when the bot is online."
    ]
};

/**
 * Returns a prebuilt Readme embed.
 * @param {import('discord.js').Client} client - Discord client instance
 * @returns {EmbedBuilder}
 */
function getReadmeEmbed(client) {
    const RULES_TEXT = README.RULES_TEXT.join("\n");
    const ROLES_TEXT = README.ROLES_TEXT.join("\n");

    return new EmbedBuilder()
        .setAuthor({
            name: "DBD.exe",
            url: "https://discord.com/invite/VRR5X8ZdXB",
        })
        .addFields(
            { name: "Rules", value: RULES_TEXT },
            { name: "Notifications", value: ROLES_TEXT }
        )
        .setColor('Purple')
        .setFooter({
            text: "Readme",
            iconURL: client.user?.displayAvatarURL() || undefined
        })
        .setTimestamp;
}

export default getReadmeEmbed;
export { README };
