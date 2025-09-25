import { User } from "../../database/index.js";
import { ROLE_CATEGORIES } from "../../config/index.js";

const ACTION_ALIASES = {
    add: ['+', 'add', 'give', 'block'],
    remove: ['-', 'remove', 'take', 'unblock'],
};

function normalizeAction(action) {
    for (const [key, aliases] of Object.entries(ACTION_ALIASES)) {
        if (aliases.includes(action)) return key;
    }
    return null;
}

export default {
    run: async (message) => {
        try {
            const args = message.content.trim().split(/\s+/);
            const rawAction = args[1]?.toLowerCase();
            const action = normalizeAction(rawAction);

            if (!action) {
                return message._send(
                    `❌ Usage: \`!pap + @user <category>\` to block, \`!pap - @user <category>\` to allow auto-promotion.`
                );
            }

            const target = message.mentions.users.first();
            if (!target) return message._send("❌ You must mention a user.");

            // Extract the category from args after the mention
            const mentionIndex = args.findIndex(arg => arg.includes(target.id) || arg.includes(target.username));
            const categoryArg = args.slice(mentionIndex + 1).join(" ").trim();

            if (!categoryArg) {
                return message._send(`❌ You must provide a category. Valid: ${Object.values(ROLE_CATEGORIES).join(", ")}`);
            }

            const validCategories = Object.values(ROLE_CATEGORIES);
            const category = validCategories.find(c => c.toLowerCase() === categoryArg.toLowerCase());
            if (!category) {
                return message._send(`❌ Invalid category. Must be one of: ${validCategories.join(", ")}`);
            }

            const [user] = await User.findOrCreate({
                where: { userId: target.id },
                defaults: { username: target.username, preventAutoPromotions: [] }
            });

            let current = user.preventAutoPromotions || [];

            if (action === 'add') {
                if (current.includes(category)) {
                    return message._send(`⚠️ User is already blocked from "${category}" promotions.`);
                }

                user.preventAutoPromotions = [...current, category];
                await user.save();
                return message._send(`✅ User is now blocked from "${category}" promotions.`);
            }

            if (action === 'remove') {
                if (!current.includes(category)) {
                    return message._send(`⚠️ User is not blocked from "${category}" promotions.`);
                }

                user.preventAutoPromotions = current.filter(c => c !== category);
                await user.save();
                return message._send(`✅ User can now be automatically promoted to "${category}".`);
            }

        } catch (error) {
            console.error(error);
            return message._send("❌ Failed to manage auto-promotion restrictions.");
        }
    }
};
