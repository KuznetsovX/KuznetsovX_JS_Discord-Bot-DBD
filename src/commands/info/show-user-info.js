import { EmbedBuilder } from 'discord.js';

import log from '../../utils/logging/log.js';

export default {
    run: async (message) => {
        // Determine the target user (mentioned user or message author)
        const target = message.mentions.members.first() || message.member;
        const user = target.user;
        const requester = message.author;

        // Log the action of requesting user information
        log.action('SHOW USER INFO', `Requested info for user: ${user.tag} by ${requester.tag}`);

        // Get the user's roles, excluding @everyone role
        const roles = target.roles.cache
            .filter(role => role.id !== message.guild.id) // Exclude @everyone
            .map(role => role.toString()) // Convert role objects to strings
            .join(', ') || 'None'; // Default to 'None' if no roles

        // Create the embed message to show the user information
        const embed = new EmbedBuilder()
            .setColor(0xDB3444) // Set embed color
            .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL({ dynamic: true }) }) // Set author info (username + avatar)
            .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 512 })) // Set thumbnail (user's avatar)
            .addFields(
                { name: '🆔 User ID', value: user.id, inline: true }, // User ID
                { name: '📛 Nickname', value: target.nickname || 'None', inline: true }, // Nickname
                { name: '📋 Roles', value: roles, inline: false }, // Roles
                { name: '📅 Joined Server', value: `<t:${Math.floor(target.joinedTimestamp / 1000)}:F>`, inline: true }, // Join date
                { name: '📆 Account Created', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:F>`, inline: true } // Account creation date
            )
            .setFooter({ text: 'User Info', iconURL: message.client.user.displayAvatarURL() }); // Footer info

        // Send the embed message to the channel
        await message.channel.send({ embeds: [embed] });

        // Log the successful sending of the user info
        log.action('SHOW USER INFO', `Info sent successfully for user: ${user.tag} by ${requester.tag}`);
    }
};
