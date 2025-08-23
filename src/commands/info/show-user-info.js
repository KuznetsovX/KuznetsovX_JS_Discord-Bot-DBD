import { EmbedBuilder } from 'discord.js';

export default {
    run: async (message) => {
        try {
            // Determine the target user (mentioned member or message author)
            const target = message.mentions.members.first() || message.member;
            const user = target.user;

            // Get the user's roles, excluding @everyone
            const roles = target.roles.cache
                .filter(role => role.id !== message.guild.id) // Exclude @everyone
                .map(role => role.toString()) // Convert role objects to strings
                .join(', ') || 'None'; // Default to 'None' if no roles

            // Create the embed message to show the user information
            const embed = new EmbedBuilder()
                .setColor('Purple')
                .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL({ dynamic: true }) })
                .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 512 }))
                .addFields(
                    { name: '🆔 User ID', value: user.id, inline: true },
                    { name: '📛 Nickname', value: target.nickname || 'None', inline: true },
                    { name: '📋 Roles', value: roles, inline: false },
                    { name: '📅 Joined Server', value: `<t:${Math.floor(target.joinedTimestamp / 1000)}:F>`, inline: true },
                    { name: '📆 Account Created', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:F>`, inline: true }
                )
                .setFooter({ text: 'User Info', iconURL: message.client.user.displayAvatarURL() });

            await message.reply({ embeds: [embed] });
        } catch (error) {
            throw new Error(`Failed to show user info: ${error.message}`);
        }
    }
};
