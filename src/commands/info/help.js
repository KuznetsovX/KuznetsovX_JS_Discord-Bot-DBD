import { EmbedBuilder } from 'discord.js';
import config from '../../config/index.js';

export default {
    run: async (message, args) => {
        // If user typed "!help <command>"
        if (args.length > 0) {
            const input = args[0].toLowerCase();

            let found;
            for (const category of Object.values(config.commands)) {
                for (const cmd of Object.values(category)) {
                    if (
                        cmd.aliases.map(a => a.toLowerCase()).includes(input)
                    ) {
                        found = cmd;
                        break;
                    }
                }
                if (found) break;
            }

            if (!found) {
                return message.reply(`❌ Command \`${input}\` not found.`);
            }

            const embed = new EmbedBuilder()
                .setTitle(`📖 Help: ${found.label}`)
                .addFields(
                    { name: 'Description', value: found.description || 'None' },
                    { name: 'Usage', value: `${config.PREFIX}${found.usage}`, inline: true },
                    { name: 'Aliases', value: found.aliases.join(', '), inline: true },
                    { name: 'Permissions', value: found.permissions.length ? found.permissions.map(r => `<@&${r}>`).join(', ') : 'Everyone' }
                )
                .setColor('Purple');

            return message.reply({ embeds: [embed] });
        }

        // Otherwise list all commands grouped by category
        const embed = new EmbedBuilder()
            .setTitle('📖 Command List')
            .setDescription(`Use \`${config.PREFIX}help <command>\` to get more info.`)
            .setColor('Purple');

        for (const [categoryName, categoryCommands] of Object.entries(config.commands)) {
            const list = Object.values(categoryCommands)
                .map(cmd => `\`${config.PREFIX}${cmd.aliases[0]}\` - ${cmd.description}`)
                .join('\n');

            embed.addFields({ name: categoryName, value: list });
        }

        return message.reply({ embeds: [embed] });
    }
};
