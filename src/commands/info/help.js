import { EmbedBuilder } from 'discord.js';
import { PREFIXES, COMMANDS } from '../../config/index.js';

export default {
    run: async (message, args) => {
        try {
            const memberRoles = message.member.roles.cache.map(r => r.id);
            const mainPrefix = PREFIXES[0];
            const allPrefixesFooter = `Available prefixes: ${PREFIXES.join(' OR ')}`;

            // If user requested help for a specific command
            if (args.length > 0) {
                const input = args[0].toLowerCase();
                let found;

                for (const category of Object.values(COMMANDS)) {
                    for (const cmd of Object.values(category)) {
                        if (cmd.aliases.map(a => a.toLowerCase()).includes(input)) {
                            found = cmd;
                            break;
                        }
                    }
                    if (found) break;
                }

                if (!found) {
                    return message._send(`❌ Command \`${input}\` not found.`);
                }

                // Format usage: prefix each example
                const usageFormatted = found.usage.map(u => `${mainPrefix}${u}`).join(' OR ');

                const embed = new EmbedBuilder()
                    .setTitle(`📖 Help: ${found.label}`)
                    .addFields(
                        { name: 'Description', value: found.description || 'None' },
                        { name: 'Usage', value: `\`${usageFormatted}\``, inline: true },
                        { name: 'Aliases', value: found.aliases.map(a => `\`${a}\``).join(', '), inline: true },
                        { name: 'Permissions', value: found.permissions.length ? found.permissions.map(r => `<@&${r}>`).join(', ') : 'Everyone' }
                    )
                    .setFooter({ text: allPrefixesFooter })
                    .setColor('Purple');

                return message._send({ embeds: [embed] });
            }

            // Otherwise, display general command list
            const embed = new EmbedBuilder()
                .setTitle('📖 Command List')
                .setDescription(`Use \`${mainPrefix}help <command>\` to get more info.`)
                .setFooter({ text: allPrefixesFooter })
                .setColor('Purple');

            for (const [categoryName, categoryCommands] of Object.entries(COMMANDS)) {
                const list = Object.values(categoryCommands)
                    .filter(cmd => cmd.permissions.length === 0 || cmd.permissions.some(r => memberRoles.includes(r)))
                    .map(cmd => `\`${mainPrefix}${cmd.aliases[0]}\` - ${cmd.description}`)
                    .join('\n');

                if (list) {
                    embed.addFields({ name: categoryName, value: list });
                }
            }

            return message._send({ embeds: [embed] });
        } catch (error) {
            throw new Error(`Failed to display help: ${error.message}`);
        }
    }
};
