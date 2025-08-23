import { User } from '../../db/user-model.js';

export default {
    run: async (message) => {
        try {
            const users = await User.findAll();

            if (!users.length) {
                return message.channel.send('📭 No users found in the database.');
            }

            const entries = users.map(u =>
                `${u.username} (${u.userId}) — Warnings: ${u.warnings || 0} — ${u.roles?.split(', ').map(r => r.split(' (')[0]).join(', ') || 'No roles'}`
            );

            // Split into message-safe chunks
            let chunk = '';
            for (const entry of entries) {
                if ((chunk + entry + '\n').length > 1900) {
                    await message.channel.send(`\`\`\`\n${chunk}\n\`\`\``);
                    chunk = '';
                }
                chunk += entry + '\n';
            }

            // Send the last chunk if any
            if (chunk.length > 0) {
                await message.channel.send(`\`\`\`\n${chunk}\n\`\`\``);
            }
        } catch (error) {
            await message.channel.send('❌ Something went wrong while listing users.');
            throw error;
        }
    }
};
