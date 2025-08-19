import config from '../../config/index.js';
import { User } from '../../db/user-model.js';
import log from '../../utils/logging/log.js';

export default {
    run: async (message) => {
        const authorTag = message.author.tag;

        try {
            const users = await User.findAll();

            if (!users.length) {
                log.action('LIST USERS', `ℹ️ ${authorTag} ran ${config.PREFIX}list-users — no users in database.`);
                return message.channel.send('📭 No users found in the database.');
            }

            const entries = users.map(u => `${u.username} (${u.userId}) — ${u.roles}`);

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

            log.action('LIST USERS', `✅ ${authorTag} listed ${users.length} users.`);
        } catch (error) {
            log.error(`❌ Error in ${config.PREFIX}list-users by ${authorTag}:`, error);
            await message.reply('❌ Something went wrong while listing users.');
        }
    }
};
