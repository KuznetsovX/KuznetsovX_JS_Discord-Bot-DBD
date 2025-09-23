import { fn, col } from 'sequelize';
import { ROLES } from '../../config/index.js';
import { User } from '../../database/index.js';

// Lookup table by role ID
const ROLES_BY_ID = Object.values(ROLES).reduce((acc, role) => {
    acc[role.id] = role;
    return acc;
}, {});

// Helper to normalize roleIds from DB
function parseRoleIds(roleIds) {
    if (!roleIds) return [];
    if (Array.isArray(roleIds)) return roleIds;

    if (typeof roleIds === 'string') {
        try {
            const parsed = JSON.parse(roleIds);
            if (Array.isArray(parsed)) return parsed.map(r => (typeof r === 'object' ? r.id : r));
        } catch { }
        return roleIds.split(',').map(r => r.trim()).filter(Boolean);
    }
    return [];
}

// Helper to map IDs to role objects
function mapRoles(ids) {
    return ids
        .map(rid => ROLES_BY_ID[rid] || { label: `Unknown Role (${rid})`, position: 9999 }) // with fallback for unknown
        .sort((a, b) => a.position - b.position);
}

// Chunked message sender
async function sendChunks(channel, lines, chunkSize = 1900) {
    let chunk = '';
    for (const line of lines) {
        if ((chunk + line + '\n').length > chunkSize) {
            await channel.send(`\`\`\`\n${chunk}\n\`\`\``);
            chunk = '';
        }
        chunk += line + '\n';
    }
    if (chunk.length) await channel.send(`\`\`\`\n${chunk}\n\`\`\``);
}

export default {
    run: async (message) => {
        try {
            const users = await User.findAll({ order: [[fn('LOWER', col('username')), 'ASC']] });

            if (!users.length) return message._send('📭 No users found in the database.');

            await message._send('📜 Full list of users:');

            const entries = users.map(u => {
                const roleIds = parseRoleIds(u.roleIds);
                const roles = mapRoles(roleIds);
                const rolesDisplay = roles.length ? roles.map(r => r.label).join(', ') : 'No roles';
                const warns = u.warnings > 0 ? ` — Warnings: ${u.warnings}` : '';
                return `${u.username} (${u.userId})${warns} — ${rolesDisplay}`;
            });

            await sendChunks(message.channel, entries);

        } catch (error) {
            await message._send('❌ Something went wrong while listing users.');
            throw new Error(`Failed to list users: ${error.message}`);
        }
    }
};
