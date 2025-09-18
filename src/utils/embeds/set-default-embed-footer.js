import COMMANDS from '../../config/commands.js';

/**
 * Sets a consistent footer for a Discord Embed.
 * Automatically looks up the command label from the command config.
 * Can optionally append a secondary text with a middle dot separator.
 *
 * @param {import('discord.js').EmbedBuilder} embed - The embed to modify
 * @param {import('discord.js').Message} message - The original message, used for client icon
 * @param {string} commandKey - The canonical key of the command
 * @param {string} [optionalText] - Optional text to append after "•"
 * @returns {import('discord.js').EmbedBuilder} - The modified embed
 */
export default function setDefaultEmbedFooter(embed, message, commandKey, optionalText) {
    // Lookup the command label from COMMANDS
    let label = commandKey; // fallback
    for (const category of Object.values(COMMANDS)) {
        if (category.commands[commandKey]) {
            label = category.commands[commandKey].label;
            break;
        }
    }

    // Compose footer text with optional extra text
    const footerText = optionalText ? `${label} • ${optionalText}` : label;

    // Apply to embed
    embed.setFooter({
        text: footerText,
        iconURL: message.client.user.displayAvatarURL()
    });

    return embed;
}
