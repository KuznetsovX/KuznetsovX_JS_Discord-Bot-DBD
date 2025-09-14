import { setBotPresence } from '../../utils/set-bot-presence.js';
import { PRESENCES } from '../../config/index.js';

export default {
    run: async (message, args) => {
        const key = args[0]?.toLowerCase().trim() || 'default';

        // Check if key exists in PRESENCES
        if (!PRESENCES[key]) {
            const validKeys = Object.keys(PRESENCES).join(', ');
            return message._send(`❌ Invalid presence key: \`${key}\`. Available keys: ${validKeys}`);
        }

        try {
            setBotPresence(message.client, key);
            await message._send(`✅ Presence set to **${key}**`);
        } catch (err) {
            console.error(err);
            await message._send('❌ Failed to update presence. Check logs for details.');
        }
    }
};
