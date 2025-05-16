const { ROLE_TIERS, ADMIN_ROLE } = require('../config/roles');
const log = require('../utils/log');

module.exports = async (message) => {
    const authorTag = message.author.tag;

    if (!message.member.roles.cache.has(ADMIN_ROLE)) {
        log.action('PROMOTE', `❌ ${authorTag} tried to use !promote without permission.`);
        return message.reply('❌ You do not have permission to use this command.');
    }

    const mentioned = message.mentions.members.first();
    if (!mentioned) {
        log.action('PROMOTE', `❌ No user mentioned by ${authorTag}.`);
        return message.reply('❌ Please mention a user to promote.');
    }

    const currentRoles = mentioned.roles.cache;
    const currentTierIndex = ROLE_TIERS.findIndex(roleId => currentRoles.has(roleId));

    if (currentTierIndex === -1) {
        log.action('PROMOTE', `❌ ${authorTag} tried to promote ${mentioned.user.tag}, but they have no tier role.`);
        return message.reply(`❌ ${mentioned} has no tier role to promote.`);
    }

    if (currentTierIndex === ROLE_TIERS.length - 1) {
        log.action('PROMOTE', `⚠️ ${authorTag} tried to promote ${mentioned.user.tag}, but they are already at the highest tier.`);
        return message.reply(`⚠️ ${mentioned} is already at the highest tier.`);
    }

    const newRoleId = ROLE_TIERS[currentTierIndex + 1];
    const oldRoleId = ROLE_TIERS[currentTierIndex];

    try {
        await mentioned.roles.remove(oldRoleId);
        await mentioned.roles.add(newRoleId);

        await message.channel.send(`🔼 Promoted ${mentioned} to tier ${currentTierIndex + 2}.`);
        log.action('PROMOTE', `✅ ${mentioned.user.tag} was promoted from tier ${currentTierIndex + 1} to tier ${currentTierIndex + 2} by ${authorTag}.`);
    } catch (error) {
        log.error(`❌ Error promoting ${mentioned.user.tag}:`, error);
        await message.reply('❌ Something went wrong while promoting the user.');
    }
};
