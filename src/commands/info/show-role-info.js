import { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, MessageFlags } from 'discord.js';
import { ROLES } from '../../config/index.js';
import setDefaultEmbedFooter from '../../utils/embeds/set-default-embed-footer.js';

export default {
    run: async (message, args, commandKey) => {
        try {
            // Case 1: interactive dropdown (no args)
            if (args.length === 0) {
                const roleSelect = new StringSelectMenuBuilder()
                    .setCustomId('role_select')
                    .setPlaceholder('Choose a role...')
                    .addOptions(
                        Object.entries(ROLES).map(([key, role]) => ({
                            label: role.label,
                            value: role.id
                        }))
                    );

                const row = new ActionRowBuilder().addComponents(roleSelect);

                const embed = new EmbedBuilder()
                    .setTitle('📜 Roles Browser')
                    .setDescription('Select a role from the dropdown below to see details.')
                    .setColor('Purple');

                setDefaultEmbedFooter(embed, message, commandKey);

                const msg = await message._send({ embeds: [embed], components: [row] });

                const collector = msg.createMessageComponentCollector({ time: 120_000 });

                collector.on('collect', async (interaction) => {
                    if (interaction.user.id !== message.author.id) {
                        return interaction.reply({
                            content: '❌ Only the command author can use this menu.',
                            flags: MessageFlags.Ephemeral
                        });
                    }

                    if (interaction.isStringSelectMenu() && interaction.customId === 'role_select') {
                        const roleId = interaction.values[0];
                        const roleEntry = Object.values(ROLES).find(r => r.id === roleId);
                        const roleMention = message.guild.roles.cache.get(roleId);

                        if (!roleEntry || !roleMention) {
                            return interaction.reply({
                                content: '❌ Role not found in config or guild.',
                                flags: MessageFlags.Ephemeral
                            });
                        }

                        const memberCount = roleMention.members.size;
                        const memberList = roleMention.members.map(m => m.user.tag).slice(0, 5);

                        const roleEmbed = new EmbedBuilder()
                            .setTitle(roleEntry.label)
                            .setDescription(roleEntry.description)
                            .addFields(
                                { name: '📌 Position', value: String(roleEntry.position), inline: true },
                                { name: '🆔 Role ID', value: `\`${roleEntry.id}\``, inline: true },
                                { name: '🎨 Color', value: roleEntry.color, inline: true },
                                ...(roleEntry.tier ? [{ name: '⭐ Tier', value: String(roleEntry.tier), inline: true }] : []),
                                { name: '👥 Member count', value: String(memberCount), inline: true },
                                ...(memberList.length > 0
                                    ? [{
                                        name: '👤 Members',
                                        value: memberList.join('\n') + (memberCount > memberList.length ? `\n…and ${memberCount - memberList.length} more` : ''),
                                        inline: false
                                    }]
                                    : [{ name: '👤 Members', value: 'None', inline: false }]),
                                ...(roleEntry.category ? [{ name: '🗂️ Category', value: String(roleEntry.category), inline: true }] : []),
                            )
                            .setColor('Purple');

                        setDefaultEmbedFooter(roleEmbed, message, commandKey);

                        return interaction.update({ embeds: [roleEmbed], components: [row] });
                    }
                });

                collector.on('end', () => {
                    const disabledRow = new ActionRowBuilder().addComponents(
                        StringSelectMenuBuilder.from(roleSelect).setDisabled(true)
                    );
                    msg.edit({ components: [disabledRow] }).catch(() => { });
                });

                return;
            }

            // Case 2: role mention (current behavior)
            const roleMention = message.mentions.roles.first();
            if (!roleMention) {
                return message._send('❌ Please mention a role. Example: `!roles @Moderator`');
            }

            const roleEntry = Object.values(ROLES).find(r => r.id === roleMention.id);
            if (!roleEntry) {
                return message._send('❌ This role is not defined in the bot configuration.');
            }

            const memberCount = roleMention.members.size;
            const memberList = roleMention.members.map(m => m.user.tag).slice(0, 5);

            const embed = new EmbedBuilder()
                .setTitle(roleEntry.label)
                .setDescription(roleEntry.description)
                .addFields(
                    { name: '📌 Position', value: String(roleEntry.position), inline: true },
                    { name: '🆔 Role ID', value: `\`${roleEntry.id}\``, inline: true },
                    { name: '🎨 Color', value: roleEntry.color, inline: true },
                    ...(roleEntry.tier ? [{ name: '⭐ Tier', value: String(roleEntry.tier), inline: true }] : []),
                    { name: '👥 Member count', value: String(memberCount), inline: true },
                    ...(memberList.length > 0
                        ? [{
                            name: '👤 Members',
                            value: memberList.join('\n') + (memberCount > memberList.length ? `\n…and ${memberCount - memberList.length} more` : ''),
                            inline: false
                        }]
                        : [{ name: '👤 Members', value: 'None', inline: false }]),
                    ...(roleEntry.category ? [{ name: '🗂️ Category', value: String(roleEntry.category), inline: true }] : []),
                )
                .setColor('Purple');

            setDefaultEmbedFooter(embed, message, commandKey);

            await message._send({ embeds: [embed] });
        } catch (error) {
            throw new Error(`❌ Failed to show role info: ${error instanceof Error ? error.message : error}`);
        }
    }
};
