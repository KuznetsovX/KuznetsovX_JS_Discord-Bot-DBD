import COMMANDS from '../../config/commands.js';

/**
 * Sets a consistent color for a Discord Embed based on the command's category.
 *
 * @param {import('discord.js').EmbedBuilder} embed - The embed to modify
 * @param {string} commandKey - The canonical key of the command
 * @returns {import('discord.js').EmbedBuilder} - The modified embed
 */
export default function setDefaultEmbedColor(embed, commandKey) {
    // Define category - color mapping
    const categoryColors = {
        info: 'Purple',
        admin: 'Red',
        moderation: 'Orange',
        fun: 'Green',
        default: 'Blue'
    };

    let categoryKey = null;

    // Find which category the command belongs to
    for (const [catKey, category] of Object.entries(COMMANDS)) {
        if (category.commands && category.commands[commandKey]) {
            categoryKey = catKey;
            break;
        }
    }

    // Pick color, fall back to default
    const color = categoryColors[categoryKey] || categoryColors.default;

    embed.setColor(color);
    return embed;
}
