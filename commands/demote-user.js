const { ROLE_TIERS, ADMIN_ROLE } = require('../config/roles');
const log = require('../utils/log');

module.exports = async (message) => {
    const authorTag = message.author.tag;

    if (!message.member.roles.cache.has(ADMIN_ROLE)) {
        log.action('DEMOTE', `❌ ${authorTag} tried to use !demote without permission.`);
        return message.reply('❌ You do not have permission to use this command.');
    }

    const mentioned = message.mentions.members.first();
    if (!mentioned) {
        log.action('DEMOTE', `❌ No user mentioned by ${authorTag}.`);
        return message.reply('❌ Please mention a user to demote.');
    }

    const currentRoles = mentioned.roles.cache;
    const currentTierIndex = ROLE_TIERS.findIndex(roleId => currentRoles.has(roleId));

    if (currentTierIndex === -1) {
        log.action('DEMOTE', `❌ ${authorTag} tried to demote ${mentioned.user.tag}, but they have no tier role.`);
        return message.reply(`❌ ${mentioned} has no tier role to demote.`);
    }

    if (currentTierIndex === 0) {
        log.action('DEMOTE', `⚠️ ${authorTag} tried to demote ${mentioned.user.tag}, but they are already at the lowest tier.`);
        return message.reply(`⚠️ ${mentioned} is already at the lowest tier.`);
    }

    const newRoleId = ROLE_TIERS[currentTierIndex - 1];
    const oldRoleId = ROLE_TIERS[currentTierIndex];

    try {
        await mentioned.roles.remove(oldRoleId);
        await mentioned.roles.add(newRoleId);

        await message.channel.send(`🔽 Demoted ${mentioned} to tier ${currentTierIndex}.`);
        log.action('DEMOTE', `✅ ${mentioned.user.tag} was demoted from tier ${currentTierIndex + 1} to tier ${currentTierIndex} by ${authorTag}.`);
    } catch (error) {
        log.error(`❌ Error demoting ${mentioned.user.tag}:`, error);
        await message.reply('❌ Something went wrong while demoting the user.');
    }
};
