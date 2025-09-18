import { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle, MessageFlags } from 'discord.js';
import { PREFIXES, COMMANDS } from '../../config/index.js';
import setDefaultEmbedFooter from '../../utils/embeds/set-default-embed-footer.js';

// normalize text for matching
const normalize = (s) => s.toLowerCase().replace(/[\s_\-]/g, '');

export default {
    run: async (message, args, commandKey) => {
        try {
            const memberRoles = message.member.roles.cache.map(r => r.id);
            const mainPrefix = PREFIXES[0];
            const allPrefixesFooter = `Available prefixes: ${PREFIXES.join(' OR ')}`;

            // Case 1: interactive mode (no args)
            if (args.length === 0) {
                const categorySelect = new StringSelectMenuBuilder()
                    .setCustomId('help_category')
                    .setPlaceholder('Choose a category...')
                    .addOptions(
                        Object.entries(COMMANDS).map(([key, cat]) => ({
                            label: cat.label,
                            value: key
                        }))
                    );

                const catRow = new ActionRowBuilder().addComponents(categorySelect);

                const embed = new EmbedBuilder()
                    .setTitle('📖 Help Browser')
                    .setDescription(`Select a **category** to view its commands.`)
                    .setColor('Purple');
                setDefaultEmbedFooter(embed, message, commandKey, allPrefixesFooter);

                const msg = await message._send({ embeds: [embed], components: [catRow] });
                const collector = msg.createMessageComponentCollector({ time: 120_000 });

                collector.on('collect', async (interaction) => {
                    if (interaction.user.id !== message.author.id) {
                        return interaction.reply({
                            content: '❌ Only the command author can use this menu.',
                            flags: MessageFlags.Ephemeral
                        });
                    }

                    // ---- Category selection ----
                    if (interaction.isStringSelectMenu() && interaction.customId === 'help_category') {
                        const catKey = interaction.values[0];
                        const category = COMMANDS[catKey];
                        if (!category) {
                            return interaction.reply({
                                content: '❌ Category not found.',
                                flags: MessageFlags.Ephemeral
                            });
                        }

                        // Build command selector
                        const commandSelect = new StringSelectMenuBuilder()
                            .setCustomId(`help_command:${catKey}`)
                            .setPlaceholder(`Choose a command from ${category.label}...`)
                            .addOptions(
                                Object.entries(category.commands)
                                    .filter(([_, cmd]) =>
                                        cmd.permissions.length === 0 ||
                                        cmd.permissions.some(r => memberRoles.includes(r))
                                    )
                                    .map(([cmdKey, cmd]) => ({
                                        label: cmd.label,
                                        value: cmdKey
                                    }))
                            );

                        const cmdRow = new ActionRowBuilder().addComponents(commandSelect);
                        const backRow = new ActionRowBuilder().addComponents(
                            new ButtonBuilder()
                                .setCustomId('back_categories')
                                .setLabel('↩ Back to Categories')
                                .setStyle(ButtonStyle.Secondary)
                        );

                        const catEmbed = new EmbedBuilder()
                            .setTitle(`📖 ${category.label}`)
                            .setDescription('Select a **command** to see detailed help.')
                            .setColor('Purple');
                        setDefaultEmbedFooter(catEmbed, message, commandKey, allPrefixesFooter);

                        return interaction.update({ embeds: [catEmbed], components: [cmdRow, backRow] });
                    }

                    // ---- Command selection ----
                    if (interaction.isStringSelectMenu() && interaction.customId.startsWith('help_command:')) {
                        const [, catKey] = interaction.customId.split(':');
                        const category = COMMANDS[catKey];
                        if (!category) return;

                        const cmdKey = interaction.values[0];
                        const cmd = category.commands[cmdKey];
                        if (!cmd) return;

                        const usageFormatted = cmd.usage
                            .map(u => `${mainPrefix}${u}`)
                            .join(' OR ');

                        const cmdEmbed = new EmbedBuilder()
                            .setTitle(`📖 Help: ${cmd.label}`)
                            .addFields(
                                { name: 'Description', value: cmd.description || 'None' },
                                { name: 'Usage', value: `\`${usageFormatted}\``, inline: true },
                                {
                                    name: 'Aliases',
                                    value: cmd.aliases.map(a => `\`${a}\``).join(', '),
                                    inline: true
                                },
                                {
                                    name: 'Permissions',
                                    value: cmd.permissions.length
                                        ? cmd.permissions.map(r => `<@&${r}>`).join(', ')
                                        : 'Everyone'
                                }
                            )
                            .setColor('Purple');
                        setDefaultEmbedFooter(cmdEmbed, message, commandKey, allPrefixesFooter);

                        return interaction.update({
                            embeds: [cmdEmbed],
                            components: interaction.message.components
                        });
                    }

                    // ---- Back to categories ----
                    if (interaction.isButton() && interaction.customId === 'back_categories') {
                        const categorySelect = new StringSelectMenuBuilder()
                            .setCustomId('help_category')
                            .setPlaceholder('Choose a category...')
                            .addOptions(
                                Object.entries(COMMANDS).map(([key, cat]) => ({
                                    label: cat.label,
                                    value: key
                                }))
                            );

                        const catRow = new ActionRowBuilder().addComponents(categorySelect);

                        const embed = new EmbedBuilder()
                            .setTitle('📖 Help Browser')
                            .setDescription(`Select a **category** to view its commands.`)
                            .setColor('Purple');
                        setDefaultEmbedFooter(embed, message, commandKey, allPrefixesFooter);

                        return interaction.update({ embeds: [embed], components: [catRow] });
                    }
                });

                collector.on('end', () => {
                    const disabled = new ActionRowBuilder().addComponents(
                        StringSelectMenuBuilder.from(categorySelect).setDisabled(true)
                    );
                    msg.edit({ components: [disabled] }).catch(() => { });
                });

                return;
            }

            // Case 2: direct lookup
            const input = normalize(args[0]);
            let found;

            for (const category of Object.values(COMMANDS)) {
                for (const cmd of Object.values(category.commands)) {
                    if (
                        cmd.aliases.some(a => normalize(a) === input) ||
                        normalize(cmd.label) === input
                    ) {
                        found = cmd;
                        break;
                    }
                }
                if (found) break;
            }

            if (!found) {
                return message._send(`❌ Command \`${args[0]}\` not found.`);
            }

            const usageFormatted = found.usage
                .map(u => `${mainPrefix}${u}`)
                .join(' OR ');

            const embed = new EmbedBuilder()
                .setTitle(`📖 Help: ${found.label}`)
                .addFields(
                    { name: 'Description', value: found.description || 'None' },
                    { name: 'Usage', value: `\`${usageFormatted}\``, inline: true },
                    {
                        name: 'Aliases',
                        value: found.aliases.map(a => `\`${a}\``).join(', '),
                        inline: true
                    },
                    {
                        name: 'Permissions',
                        value: found.permissions.length
                            ? found.permissions.map(r => `<@&${r}>`).join(', ')
                            : 'Everyone'
                    }
                )
                .setColor('Purple');
            setDefaultEmbedFooter(embed, message, commandKey, allPrefixesFooter);

            return message._send({ embeds: [embed] });
        } catch (error) {
            throw new Error(`Failed to display help: ${error.message}`);
        }
    }
};
