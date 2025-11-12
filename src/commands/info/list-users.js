import { User } from '../../database/index.js';
import { ROLES } from '../../config/index.js';

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
            await channel.send(`\`\`\`\n${chunk.trim()}\n\`\`\``);
            chunk = '';
        }
        chunk += `${line}\n`;
    }
    if (chunk) await channel.send(`\`\`\`\n${chunk.trim()}\n\`\`\``);
}

export default {
    run: async (message) => {
        try {
            const users = await User.findAll();

            if (!users.length) return message._send('📭 No users found in the database.');

            // Ask user how to sort
            const sortPrompt = await message._send('How would you like to sort the user list? 🪪 — by **name**, 👑 — by **role**');
            await sortPrompt.react('🪪');
            await sortPrompt.react('👑');

            const filter = (reaction, user) => ['🪪', '👑'].includes(reaction.emoji.name) && user.id === message.author.id;

            const collected = await sortPrompt
                .awaitReactions({
                    filter,
                    max: 1,
                    time: 10_000,
                    errors: ['time'],
                })
                .catch(() => null);

            // Handle timeout
            if (!collected?.size) {
                await sortPrompt.delete().catch(() => { });
                await message._send('⌛ Timed out — please use the command again.');
                return;
            }

            const chosen = collected.first().emoji.name;
            const sortMode = chosen === '🪪' ? 'name' : 'role';

            // Cleanup — remove reactions & delete prompt
            await sortPrompt.reactions.removeAll().catch(() => { });
            await sortPrompt.delete().catch(() => { });

            // Prepare data
            const entries = users.map(u => {
                const roles = mapRoles(parseRoleIds(u.roleIds));
                const topRole = roles[0];
                const warns = u.warnings > 0 ? ` — Warnings: ${u.warnings}` : '';
                return {
                    username: u.username,
                    userId: u.userId,
                    warns,
                    rolesDisplay: roles.length ? roles.map(r => r.label).join(', ') : 'No roles',
                    topRolePosition: topRole ? topRole.position : 9999,
                };
            });

            // Sort based on chosen mode
            entries.sort((a, b) => {
                if (sortMode === 'role')
                    return a.topRolePosition - b.topRolePosition;
                return a.username.localeCompare(b.username, undefined, { sensitivity: 'base' });
            });

            await message._send(`📜 Full list of users (sorted by **${sortMode}**):`);

            const lines = entries.map(
                e => `${e.username} (${e.userId})${e.warns} — ${e.rolesDisplay}`
            );

            await sendChunks(message.channel, lines);

        } catch (error) {
            throw new Error(`❌ Failed to list users: ${error instanceof Error ? error.message : error}`);
        }
    }
};
