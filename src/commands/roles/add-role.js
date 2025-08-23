import config from '../../config/index.js';
import { syncUserToDB } from '../../db/utils/sync-user-to-db.js';
import manageTierRoles from '../../utils/roles/auto-manage-tier-roles.js';

export default {
    run: async (message) => {
        try {
            const author = message.member;
            const mentioned = message.mentions.members.first();
            if (!mentioned) {
                return message.channel.send(`❌ ${author}, please mention a user to add a role to.`);
            }

            const mentionedRole = message.mentions.roles.first();
            if (!mentionedRole) {
                return message.channel.send(`❌ ${author}, please mention a role to add.`);
            }

            if (mentioned.roles.cache.has(mentionedRole.id)) {
                return message.channel.send(`⚠️ ${author}, user already has this role.`);
            }

            const authorHighest = author.roles.highest;
            if (mentionedRole.position >= authorHighest.position) {
                return message.channel.send(`❌ ${author}, you cannot assign a role equal to or higher than your highest role.`);
            }

            const botMember = message.guild.members.me;
            if (!botMember || mentionedRole.position >= botMember.roles.highest.position) {
                return message.channel.send(`❌ ${author}, I do not have permission to assign that role.`);
            }

            await mentioned.roles.add(mentionedRole);
            await syncUserToDB(mentioned);

            if (config.ROLE_TIERS.includes(mentionedRole.id)) {
                await manageTierRoles(mentioned);
            }

            return message.channel.send(`✅ ${author}, role was successfully added to the user.`);
        } catch (error) {
            throw new Error(`Failed to add role ${message.mentions.roles.first()?.name || 'unknown'} to ${message.mentions.members.first()?.user.tag || 'unknown'}: ${error.message}`);
        }
    }
};
