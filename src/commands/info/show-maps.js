import { EmbedBuilder, AttachmentBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle, MessageFlags } from 'discord.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { MAPS, ROLES } from '../../config/index.js';

// resolve root for assets
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../../..');

// normalize text for matching
const normalize = (s) => s.toLowerCase().replace(/[\s_\-]/g, '');

// find a tile by label, key, or aliases
const resolveMap = (query) => {
    const q = normalize(query);
    const entries = Object.entries(MAPS).flatMap(([realmKey, realm]) =>
        Object.entries(realm.maps).map(([mapKey, map]) => ({ realmKey, realm, mapKey, map }))
    );

    // exact match by label or key
    let hit = entries.find(({ mapKey, map }) => normalize(map.label) === q || normalize(mapKey) === q);
    if (hit) return hit;

    // exact match by alias
    hit = entries.find(({ map }) => Array.isArray(map.aliases) && map.aliases.map(normalize).includes(q));
    if (hit) return hit;

    // unique startsWith
    const starts = entries.filter(({ mapKey, map }) =>
        normalize(map.label).startsWith(q) ||
        normalize(mapKey).startsWith(q) ||
        (Array.isArray(map.aliases) && map.aliases.some(a => normalize(a).startsWith(q)))
    );
    if (starts.length === 1) return starts[0];

    // unique includes
    const includes = entries.filter(({ mapKey, map }) =>
        normalize(map.label).includes(q) ||
        normalize(mapKey).includes(q) ||
        (Array.isArray(map.aliases) && map.aliases.some(a => normalize(a).includes(q)))
    );
    if (includes.length === 1) return includes[0];

    return null; // not found
};

export default {
    run: async (message, args) => {
        try {
            const member = message.member;
            const isAdmin = member.roles.cache.has(ROLES.ADMIN.id);

            // Case 1: interactive mode (no args)
            if (args.length === 0) {
                const realmSelect = new StringSelectMenuBuilder()
                    .setCustomId('realm_select')
                    .setPlaceholder('Choose a realm...')
                    .addOptions(
                        Object.entries(MAPS).map(([realmKey, realm]) => ({
                            label: realm.label,
                            value: realmKey
                        }))
                    );

                const realmRow = new ActionRowBuilder().addComponents(realmSelect);

                const embed = new EmbedBuilder()
                    .setTitle('🗺️ Map Browser')
                    .setDescription('Select a **realm** from the dropdown below.')
                    .setColor('Purple');

                const msg = await message._send({
                    embeds: [embed],
                    components: [realmRow]
                });

                const collector = msg.createMessageComponentCollector({ time: 120_000 });

                collector.on('collect', async (interaction) => {
                    // If not the command author, send ephemeral message
                    if (interaction.user.id !== message.author.id) {
                        return interaction.reply({
                            content: '❌ Only the command author can use this menu.',
                            flags: MessageFlags.Ephemeral
                        });
                    }

                    // ----- Realm selected -----
                    if (interaction.isStringSelectMenu() && interaction.customId === 'realm_select') {
                        const realmKey = interaction.values[0];
                        const realm = MAPS[realmKey];
                        if (!realm) return interaction.reply({
                            content: '❌ Realm not found.',
                            flags: MessageFlags.Ephemeral
                        });

                        const mapSelect = new StringSelectMenuBuilder()
                            .setCustomId(`map_select:${realmKey}`)
                            .setPlaceholder(`Choose a map from ${realm.label}...`)
                            .addOptions(
                                Object.entries(realm.maps).map(([mapKey, map]) => ({
                                    label: map.label,
                                    value: mapKey
                                }))
                            );

                        const mapRow = new ActionRowBuilder().addComponents(mapSelect);
                        const backRow = new ActionRowBuilder().addComponents(
                            new ButtonBuilder()
                                .setCustomId('back_realms')
                                .setLabel('↩ Back to Realms')
                                .setStyle(ButtonStyle.Secondary)
                        );

                        const realmEmbed = new EmbedBuilder()
                            .setTitle(`🗺️ ${realm.label}`)
                            .setDescription('Now select a **map** from the dropdown below.')
                            .setColor('Purple');

                        return interaction.update({
                            embeds: [realmEmbed],
                            components: [mapRow, backRow]
                        });
                    }

                    // ----- Map selected -----
                    if (interaction.isStringSelectMenu() && interaction.customId.startsWith('map_select:')) {
                        const [, realmKey] = interaction.customId.split(':');
                        const realm = MAPS[realmKey];
                        if (!realm) return;

                        const mapKey = interaction.values[0];
                        const map = realm.maps[mapKey];
                        if (!map) return;

                        const filePath = path.join(projectRoot, map.image.replace('../../', ''));
                        const file = new AttachmentBuilder(filePath, { name: 'map.jpg' });

                        const mapEmbed = new EmbedBuilder()
                            .setTitle(`${map.label} (${realm.label})`)
                            .setImage('attachment://map.jpg')
                            .setColor('Purple');

                        const mapSelect = new StringSelectMenuBuilder()
                            .setCustomId(`map_select:${realmKey}`)
                            .setPlaceholder(`Choose another map from ${realm.label}...`)
                            .addOptions(
                                Object.entries(realm.maps).map(([mKey, m]) => ({
                                    label: m.label,
                                    value: mKey
                                }))
                            );

                        const mapRow = new ActionRowBuilder().addComponents(mapSelect);
                        const backRow = new ActionRowBuilder().addComponents(
                            new ButtonBuilder()
                                .setCustomId('back_realms')
                                .setLabel('↩ Back to Realms')
                                .setStyle(ButtonStyle.Secondary)
                        );

                        return interaction.update({
                            embeds: [mapEmbed],
                            files: [file],
                            components: [mapRow, backRow]
                        });
                    }

                    // ----- Back to realms -----
                    if (interaction.isButton() && interaction.customId === 'back_realms') {
                        const realmSelect = new StringSelectMenuBuilder()
                            .setCustomId('realm_select')
                            .setPlaceholder('Choose a realm...')
                            .addOptions(
                                Object.entries(MAPS).map(([realmKey, realm]) => ({
                                    label: realm.label,
                                    value: realmKey
                                }))
                            );

                        const realmRow = new ActionRowBuilder().addComponents(realmSelect);

                        const embed = new EmbedBuilder()
                            .setTitle('🗺️ Map Browser')
                            .setDescription('Select a **realm** from the dropdown below.')
                            .setColor('Purple');

                        return interaction.update({ embeds: [embed], files: [], components: [realmRow] });
                    }
                });

                collector.on('end', () => {
                    const disabledRealm = new ActionRowBuilder().addComponents(
                        StringSelectMenuBuilder.from(
                            new StringSelectMenuBuilder()
                                .setCustomId('realm_select')
                                .setPlaceholder('Choose a realm...')
                                .addOptions(
                                    Object.entries(MAPS).map(([realmKey, realm]) => ({
                                        label: realm.label,
                                        value: realmKey
                                    }))
                                )
                        ).setDisabled(true)
                    );
                    msg.edit({ components: [disabledRealm] }).catch(() => { });
                });

                return;
            }

            // Case 2: "all" - show all images (Admins only)
            if (args.length === 1 && normalize(args[0]) === 'all') {
                if (!isAdmin) {
                    return message._send('⚠️ Only administrators can view all map images at once.');
                }

                for (const [realmKey, realm] of Object.entries(MAPS)) {
                    for (const map of Object.values(realm.maps)) {
                        const filePath = path.join(projectRoot, map.image.replace('../../', ''));
                        const file = new AttachmentBuilder(filePath, { name: 'map.jpg' });

                        const embed = new EmbedBuilder()
                            .setTitle(`${map.label} (${realm.label})`)
                            .setImage('attachment://map.jpg')
                            .setColor('Purple');

                        await message._send({ embeds: [embed], files: [file] });
                    }
                }
                return;
            }

            // Case 3: direct lookup
            const inputRaw = args.join(' ').trim();
            const hit = resolveMap(inputRaw);

            if (!hit) {
                return message._send(`❌ Map \`${inputRaw}\` not found or ambiguous. Try the exact label.`);
            }

            const { map, realm } = hit;
            const filePath = path.join(projectRoot, map.image.replace('../../', ''));
            const file = new AttachmentBuilder(filePath, { name: 'map.jpg' });

            const embed = new EmbedBuilder()
                .setTitle(`${map.label} (${realm.label})`)
                .setImage('attachment://map.jpg')
                .setColor('Purple');

            return message._send({ embeds: [embed], files: [file] });

        } catch (error) {
            throw new Error(`Failed to display maps: ${error.message}`);
        }
    }
};
