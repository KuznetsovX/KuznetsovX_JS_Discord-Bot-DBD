import { fn, col } from 'sequelize';
import { User } from '../../database/index.js';

export default {
    run: async (message) => {
        try {
            const users = await User.findAll({
                order: [[fn('LOWER', col('username')), 'ASC']]
            });

            if (!users.length) {
                return message._send('📭 No users found in the database.');
            }

            await message._send(`📜 Full list of users:`);

            const entries = users.map(u => {
                const roles = u.roles || 'No roles';
                return `${u.username} (${u.userId}) — Warnings: ${u.warnings || 0} — ${roles}`;
            });

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
