import { EmbedBuilder, AttachmentBuilder, ActionRowBuilder, StringSelectMenuBuilder, MessageFlags } from 'discord.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { TILES, ROLES } from '../../config/index.js';
import setDefaultEmbedFooter from '../../utils/embeds/set-default-embed-footer.js';

// resolve root for assets
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../../..');

// normalize text for matching
const normalize = (s) => s.toLowerCase().replace(/[\s_\-]/g, '');

// find a tile by label, key, or aliases
const resolveTile = (query) => {
    const q = normalize(query);
    const entries = Object.entries(TILES);

    // exact match by label or key
    let hit = entries.find(([key, t]) => normalize(t.label) === q || normalize(key) === q);
    if (hit) return hit[1];

    // exact match by alias
    hit = entries.find(([_, t]) => Array.isArray(t.aliases) && t.aliases.map(normalize).includes(q));
    if (hit) return hit[1];

    // unique startsWith
    const starts = entries.filter(([key, t]) =>
        normalize(t.label).startsWith(q) ||
        normalize(key).startsWith(q) ||
        (Array.isArray(t.aliases) && t.aliases.some(a => normalize(a).startsWith(q)))
    );
    if (starts.length === 1) return starts[0][1];

    // unique includes
    const includes = entries.filter(([key, t]) =>
        normalize(t.label).includes(q) ||
        normalize(key).includes(q) ||
        (Array.isArray(t.aliases) && t.aliases.some(a => normalize(a).includes(q)))
    );
    if (includes.length === 1) return includes[0][1];

    return null; // not found
};

export default {
    run: async (message, args, commandKey) => {
        try {
            const member = message.member;
            const isAdmin = member.roles.cache.has(ROLES.ADMIN.id);

            // Case 1: interactive mode (no args)
            if (args.length === 0) {
                const tileSelect = new StringSelectMenuBuilder()
                    .setCustomId('tile_select')
                    .setPlaceholder('Choose a tile...')
                    .addOptions(
                        Object.entries(TILES).map(([key, tile]) => ({
                            label: tile.label,
                            value: key
                        }))
                    );

                const row = new ActionRowBuilder().addComponents(tileSelect);

                const embed = new EmbedBuilder()
                    .setTitle('🏚️ Tile Browser')
                    .setDescription('Select a tile from the dropdown below.')
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

                    if (interaction.isStringSelectMenu() && interaction.customId === 'tile_select') {
                        const tileKey = interaction.values[0];
                        const tile = TILES[tileKey];
                        if (!tile) return interaction.reply({
                            content: '❌ Tile not found.',
                            flags: MessageFlags.Ephemeral
                        });

                        const filePath = path.join(projectRoot, tile.image.replace('../../', ''));
                        const file = new AttachmentBuilder(filePath, { name: 'tile.jpg' });

                        const tileEmbed = new EmbedBuilder()
                            .setTitle(tile.label)
                            .setImage('attachment://tile.jpg')
                            .setColor('Purple');
                        setDefaultEmbedFooter(tileEmbed, message, commandKey);

                        return interaction.update({
                            embeds: [tileEmbed],
                            files: [file],
                            components: [row] // keep the menu active for continuous browsing
                        });
                    }
                });

                collector.on('end', () => {
                    // disable the dropdown after timeout
                    const disabledRow = new ActionRowBuilder().addComponents(
                        StringSelectMenuBuilder.from(tileSelect).setDisabled(true)
                    );
                    msg.edit({ components: [disabledRow] }).catch(() => { });
                });

                return;
            }

            // Case 2: "all" - show all images (Admins only)
            if (args.length === 1 && normalize(args[0]) === 'all') {
                if (!isAdmin) {
                    return message._send('⚠️ Only administrators can view all tile images at once.');
                }

                for (const tile of Object.values(TILES)) {
                    const filePath = path.join(projectRoot, tile.image.replace('../../', ''));
                    const file = new AttachmentBuilder(filePath, { name: 'tile.jpg' });

                    const embed = new EmbedBuilder()
                        .setTitle(tile.label)
                        .setImage('attachment://tile.jpg')
                        .setColor('Purple');
                    setDefaultEmbedFooter(embed, message, commandKey);

                    await message._send({ embeds: [embed], files: [file] });
                }
                return;
            }

            // Case 3: direct lookup
            const inputRaw = args.join(' ').trim();
            const tile = resolveTile(inputRaw);

            if (!tile) {
                return message._send(`❌ Tile \`${inputRaw}\` not found or ambiguous. Try the exact label.`);
            }

            const filePath = path.join(projectRoot, tile.image.replace('../../', ''));
            const file = new AttachmentBuilder(filePath, { name: 'tile.jpg' });

            const embed = new EmbedBuilder()
                .setTitle(tile.label)
                .setImage('attachment://tile.jpg')
                .setColor('Purple');
            setDefaultEmbedFooter(embed, message, commandKey);

            return message._send({ embeds: [embed], files: [file] });
        } catch (error) {
            throw new Error(`Failed to display tiles: ${error.message}`);
        }
    }
};
