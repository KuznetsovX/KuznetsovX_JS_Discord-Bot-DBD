const { EmbedBuilder } = require('discord.js');
const log = require('../utils/log');

module.exports = async (message) => {
    const target = message.mentions.members.first() || message.member;
    const user = target.user;
    const requester = message.author;

    log.action('SHOW USER INFO', `Requested info for user: ${user.tag} by ${requester.tag}`);

    const roles = target.roles.cache
        .filter(role => role.id !== message.guild.id) // Exclude @everyone
        .map(role => role.toString())
        .join(', ') || 'None';

    const embed = new EmbedBuilder()
        .setColor(0xDB3444)
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

    await message.channel.send({ embeds: [embed] });

    log.action('SHOW USER INFO', `Info sent successfully for user: ${user.tag} by ${requester.tag}`);
};
