import { EmbedBuilder, AttachmentBuilder } from 'discord.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { MAPS, ROLES } from '../../config/index.js';

// resolve root for assets
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../../..');

// normalize text for matching
const normalize = (s) => s.toLowerCase().replace(/[\s_\-]/g, '');

// find a map by query across all realms
const resolveMap = (query) => {
    const q = normalize(query);

    const entries = Object.entries(MAPS).flatMap(([realmKey, realm]) =>
        Object.entries(realm.maps).map(([mapKey, map]) => ({
            realmKey,
            realm,
            mapKey,
            map
        }))
    );

    // exact match by label or key
    let hit = entries.find(({ mapKey, map }) =>
        normalize(map.label) === q || normalize(mapKey) === q
    );
    if (hit) return hit;

    // exact match by alias
    hit = entries.find(({ map }) =>
        Array.isArray(map.aliases) && map.aliases.map(normalize).includes(q)
    );
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

            // Case 1: no args → show list of maps grouped by realm
            if (args.length === 0) {
                let desc = '';
                for (const [realmKey, realm] of Object.entries(MAPS)) {
                    desc += `**${realm.label}**:\n`;
                    for (const map of Object.values(realm.maps)) {
                        const aliases = map.aliases?.length
                            ? map.aliases.join(', ')
                            : 'none';
                        desc += `• ${map.label} — \`${aliases}\`\n`;
                    }
                    desc += '\n';
                }

                const embed = new EmbedBuilder()
                    .setTitle('🗺️ Available Maps')
                    .setDescription(desc)
                    .setColor('Purple');

                return message._send({ embeds: [embed] });
            }

            // Case 2: "all" → show all maps (Admins only)
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

            // Case 3: specific map lookup
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
