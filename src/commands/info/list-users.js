import { User } from '../../db/user-model.js';

export default {
    run: async (message) => {
        try {
            const users = await User.findAll();

            if (!users.length) {
                return message._send('📭 No users found in the database.');
            }

            await message._send(`📜 Sending you the full list of users in the database:`);

            const entries = users.map(u => {
                const roles = u.roles?.split(', ').map(r => r.split(' (')[0]).join(', ') || 'No roles';
                return `${u.username} (${u.userId}) — Warnings: ${u.warnings || 0} — ${roles}`;
            });

            // Send in message-safe chunks via plain channel.send
            let chunk = '';
            for (const entry of entries) {
                if ((chunk + entry + '\n').length > 1900) {
                    await message.channel.send(`\`\`\`\n${chunk}\n\`\`\``);
                    chunk = '';
                }
                chunk += entry + '\n';
            }

            if (chunk.length > 0) {
                await message.channel.send(`\`\`\`\n${chunk}\n\`\`\``);
            }
        } catch (error) {
            await message._send('❌ Something went wrong while listing users.');
            throw new Error(`Failed to list users: ${error.message}`);
        }
    }
};
