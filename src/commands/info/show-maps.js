import { EmbedBuilder, AttachmentBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle, MessageFlags } from 'discord.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { MAPS, ROLES } from '../../config/index.js';
import setDefaultEmbedFooter from '../../utils/embeds/set-default-embed-footer.js';

// resolve root for assets
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../../..');

// normalize text for matching
const normalize = (s) => s.toLowerCase().replace(/[\s_\-]/g, '');

// helper: safe file loading with timeout & fallback
const safeLoadImage = async (filePath, timeoutMs = 7000) => {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error('Timeout')), timeoutMs);
        import('fs').then(fs => {
            fs.access(filePath, fs.constants.F_OK, (err) => {
                clearTimeout(timer);
                if (err) return reject(new Error('File not found'));
                resolve(new AttachmentBuilder(filePath, { name: 'map.jpg' }));
            });
        });
    });
};

// helper: graceful failure handler
const showLoadError = async (interaction, message, commandKey, text = '⚠️ Failed to load image.') => {
    const errorEmbed = new EmbedBuilder()
        .setTitle('Error')
        .setDescription(text)
        .setColor('Red');
    setDefaultEmbedFooter(errorEmbed, message, commandKey);

    try {
        await interaction.update({ embeds: [errorEmbed], files: [], components: [] });
    } catch (err) {
        if (err.code === 10062) {
            // interaction expired -> followUp fallback
            await interaction.followUp({
                embeds: [errorEmbed],
                flags: MessageFlags.Ephemeral
            }).catch(() => { });
        } else {
            try {
                await interaction.reply({ embeds: [errorEmbed], flags: MessageFlags.Ephemeral });
            } catch (_) { }
        }
    }
};

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
    run: async (message, args, commandKey) => {
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
                setDefaultEmbedFooter(embed, message, commandKey);

                const msg = await message._send({
                    embeds: [embed],
                    components: [realmRow]
                });

                const collector = msg.createMessageComponentCollector({ time: 120_000 });

                collector.on('collect', async (interaction) => {
                    // Only allow the command author to interact
                    if (interaction.user.id !== message.author.id) {
                        return interaction.reply({
                            content: '❌ Only the command author can use this menu.',
                            flags: MessageFlags.Ephemeral
                        });
                    }

                    try {
                        // Immediately defer to prevent "Unknown interaction"
                        await interaction.deferUpdate().catch(() => { });

                        // ----- Realm selected -----
                        if (interaction.isStringSelectMenu() && interaction.customId === 'realm_select') {
                            const realmKey = interaction.values[0];
                            const realm = MAPS[realmKey];
                            if (!realm) return;

                            const mapSelect = new StringSelectMenuBuilder()
                                .setCustomId(`map_select:${realmKey}`)
                                .setPlaceholder(`Choose a map from ${realm.label}...`)
                                .addOptions(
                                    Object.entries(realm.maps)
                                        .filter(([_, m]) => !m.alt)
                                        .map(([mapKey, map]) => ({ label: map.label, value: mapKey }))
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
                            setDefaultEmbedFooter(realmEmbed, message, commandKey);

                            return interaction.editReply({ embeds: [realmEmbed], components: [mapRow, backRow] });
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
                            let file;
                            try {
                                file = await safeLoadImage(filePath);
                            } catch (err) {
                                console.warn(`[MapLoader] Failed to load image: ${filePath} | ${err.message}`);
                                return showLoadError(interaction, message, commandKey);
                            }

                            const mapEmbed = new EmbedBuilder()
                                .setTitle(`${map.label} (${realm.label})`)
                                .setImage('attachment://map.jpg')
                                .setColor('Purple');
                            setDefaultEmbedFooter(mapEmbed, message, commandKey);

                            const mapSelectRow = new ActionRowBuilder().addComponents(
                                new StringSelectMenuBuilder()
                                    .setCustomId(`map_select:${realmKey}`)
                                    .setPlaceholder(`Choose another map from ${realm.label}...`)
                                    .addOptions(
                                        Object.entries(realm.maps)
                                            .filter(([_, m]) => !m.alt)
                                            .map(([mKey, m]) => ({ label: m.label, value: mKey }))
                                    )
                            );

                            const rows = [mapSelectRow];

                            if (Array.isArray(map.alts) && map.alts.length > 0) {
                                const toggleAltRow = new ActionRowBuilder().addComponents(
                                    new ButtonBuilder()
                                        .setCustomId(`toggle_alt:${realmKey}:${mapKey}`)
                                        .setLabel('Show alternate version')
                                        .setStyle(ButtonStyle.Secondary)
                                );
                                rows.push(toggleAltRow);
                            }

                            const backRow = new ActionRowBuilder().addComponents(
                                new ButtonBuilder()
                                    .setCustomId('back_realms')
                                    .setLabel('↩ Back to Realms')
                                    .setStyle(ButtonStyle.Secondary)
                            );
                            rows.push(backRow);

                            return interaction.editReply({ embeds: [mapEmbed], files: [file], components: rows });
                        }

                        // ----- Toggle alt (show first alt) -----
                        if (interaction.isButton() && interaction.customId.startsWith('toggle_alt:')) {
                            const [, realmKey, baseMapKey] = interaction.customId.split(':');
                            const realm = MAPS[realmKey];
                            if (!realm) return;
                            const baseMap = realm.maps[baseMapKey];
                            if (!baseMap || !baseMap.alts?.length) return;

                            const altKey = baseMap.alts[0];
                            const altMap = realm.maps[altKey];
                            if (!altMap) return;

                            const filePath = path.join(projectRoot, altMap.image.replace('../../', ''));
                            let file;
                            try {
                                file = await safeLoadImage(filePath);
                            } catch (err) {
                                console.warn(`[MapLoader] Failed to load alt image: ${filePath} | ${err.message}`);
                                return showLoadError(interaction, message, commandKey);
                            }

                            const altEmbed = new EmbedBuilder()
                                .setTitle(`${altMap.label} (${realm.label})`)
                                .setImage('attachment://map.jpg')
                                .setColor('Purple');
                            setDefaultEmbedFooter(altEmbed, message, commandKey);

                            const mapSelectRow = new ActionRowBuilder().addComponents(
                                new StringSelectMenuBuilder()
                                    .setCustomId(`map_select:${realmKey}`)
                                    .setPlaceholder(`Choose another map from ${realm.label}...`)
                                    .addOptions(
                                        Object.entries(realm.maps)
                                            .filter(([_, m]) => !m.alt)
                                            .map(([mKey, m]) => ({ label: m.label, value: mKey }))
                                    )
                            );

                            const toggleBackRow = new ActionRowBuilder().addComponents(
                                new ButtonBuilder()
                                    .setCustomId(`toggle_back:${realmKey}:${baseMapKey}`)
                                    .setLabel('Back to original map')
                                    .setStyle(ButtonStyle.Secondary)
                            );

                            const backRealmsRow = new ActionRowBuilder().addComponents(
                                new ButtonBuilder()
                                    .setCustomId('back_realms')
                                    .setLabel('↩ Back to Realms')
                                    .setStyle(ButtonStyle.Secondary)
                            );

                            return interaction.editReply({
                                embeds: [altEmbed],
                                files: [file],
                                components: [mapSelectRow, toggleBackRow, backRealmsRow]
                            });
                        }

                        // ----- Toggle back to original -----
                        if (interaction.isButton() && interaction.customId.startsWith('toggle_back:')) {
                            const [, realmKey, baseMapKey] = interaction.customId.split(':');
                            const realm = MAPS[realmKey];
                            if (!realm) return;
                            const map = realm.maps[baseMapKey];
                            if (!map) return;

                            const filePath = path.join(projectRoot, map.image.replace('../../', ''));
                            let file;
                            try {
                                file = await safeLoadImage(filePath);
                            } catch (err) {
                                console.warn(`[MapLoader] Failed to load original image: ${filePath} | ${err.message}`);
                                return showLoadError(interaction, message, commandKey);
                            }

                            const mapEmbed = new EmbedBuilder()
                                .setTitle(`${map.label} (${realm.label})`)
                                .setImage('attachment://map.jpg')
                                .setColor('Purple');
                            setDefaultEmbedFooter(mapEmbed, message, commandKey);

                            const mapSelectRow = new ActionRowBuilder().addComponents(
                                new StringSelectMenuBuilder()
                                    .setCustomId(`map_select:${realmKey}`)
                                    .setPlaceholder(`Choose another map from ${realm.label}...`)
                                    .addOptions(
                                        Object.entries(realm.maps)
                                            .filter(([_, m]) => !m.alt)
                                            .map(([mKey, m]) => ({ label: m.label, value: mKey }))
                                    )
                            );

                            const rows = [mapSelectRow];

                            if (Array.isArray(map.alts) && map.alts.length > 0) {
                                rows.push(new ActionRowBuilder().addComponents(
                                    new ButtonBuilder()
                                        .setCustomId(`toggle_alt:${realmKey}:${baseMapKey}`)
                                        .setLabel('Show alternate version')
                                        .setStyle(ButtonStyle.Secondary)
                                ));
                            }

                            rows.push(new ActionRowBuilder().addComponents(
                                new ButtonBuilder()
                                    .setCustomId('back_realms')
                                    .setLabel('↩ Back to Realms')
                                    .setStyle(ButtonStyle.Secondary)
                            ));

                            return interaction.editReply({
                                embeds: [mapEmbed],
                                files: [file],
                                components: rows
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
                            setDefaultEmbedFooter(embed, message, commandKey);

                            return interaction.editReply({ embeds: [embed], files: [], components: [realmRow] });
                        }
                    } catch (err) {
                        console.error(`[InteractionError] ${err.message}`);
                        await showLoadError(interaction, message, commandKey, '⚠️ Something went wrong with this interaction.');
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
                        let file;
                        try {
                            file = await safeLoadImage(filePath);
                        } catch (err) {
                            console.warn(`[MapLoader] Failed to load (all mode): ${filePath} | ${err.message}`);
                            continue;
                        }

                        const embed = new EmbedBuilder()
                            .setTitle(`${map.label} (${realm.label})`)
                            .setImage('attachment://map.jpg')
                            .setColor('Purple');
                        setDefaultEmbedFooter(embed, message, commandKey);

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
            let file;
            try {
                file = await safeLoadImage(filePath);
            } catch (err) {
                console.warn(`[MapLoader] Failed to load direct lookup: ${filePath} | ${err.message}`);
                return message._send('⚠️ Failed to load the requested map image.');
            }

            const embed = new EmbedBuilder()
                .setTitle(`${map.label} (${realm.label})`)
                .setImage('attachment://map.jpg')
                .setColor('Purple');
            setDefaultEmbedFooter(embed, message, commandKey);

            // For direct lookup, include the toggle button if the map has alts (keeps parity with interactive mode)
            const components = [];
            if (map.alts?.length) {
                components.push(new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId(`toggle_alt:${Object.keys(MAPS).find(k => MAPS[k] === realm)}:${Object.keys(realm.maps).find(k => realm.maps[k] === map)}`)
                        .setLabel('Show alternate version')
                        .setStyle(ButtonStyle.Secondary)
                ));
            }

            return message._send({
                embeds: [embed],
                files: [file],
                components
            });

        } catch (error) {
            throw new Error(`Failed to display maps: ${error.message}`);
        }
    }
};
