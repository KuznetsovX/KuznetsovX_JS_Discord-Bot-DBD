const { ROLE_TIERS, ADMIN_ROLE } = require('../config/roles');
const log = require('../utils/log');
const updateUserInDB = require('../utils/update-user-db');

module.exports = async (message) => {
    const authorTag = message.author.tag;

    // Ensure the user has the required role to use the command
    if (!message.member.roles.cache.has(ADMIN_ROLE)) {
        log.action('DEMOTE', `❌ ${authorTag} tried to use !demote without permission.`);
        return message.reply('❌ You do not have permission to use this command.');
    }

    // Ensure a user is mentioned
    const mentioned = message.mentions.members.first();
    if (!mentioned) {
        log.action('DEMOTE', `❌ No user mentioned by ${authorTag}.`);
        return message.reply('❌ Please mention a user to demote.');
    }

    const currentRoles = mentioned.roles.cache;
    const currentTierIndex = ROLE_TIERS.findIndex(roleId => currentRoles.has(roleId)); // Find the index of the current tier

    // Check if the user has a tier role
    if (currentTierIndex === -1) {
        log.action('DEMOTE', `❌ ${authorTag} tried to demote ${mentioned.user.tag}, but they have no tier role.`);
        return message.reply(`❌ ${mentioned} has no tier role to demote.`);
    }

    // Check if the user is already at the lowest tier
    if (currentTierIndex === 0) {
        log.action('DEMOTE', `⚠️ ${authorTag} tried to demote ${mentioned.user.tag}, but they are already at the lowest tier.`);
        return message.reply(`⚠️ ${mentioned} is already at the lowest tier.`);
    }

    // Get the new role to assign
    const newRoleId = ROLE_TIERS[currentTierIndex - 1];
    const oldRoleId = ROLE_TIERS[currentTierIndex];

    // Attempt to remove the current role and add the new role
    try {
        await mentioned.roles.remove(oldRoleId);
        await mentioned.roles.add(newRoleId);

        await message.channel.send(`🔽 Demoted ${mentioned} to tier ${currentTierIndex}.`);
        log.action('DEMOTE', `✅ ${mentioned.user.tag} was demoted from tier ${currentTierIndex + 1} to tier ${currentTierIndex} by ${authorTag}.`);
        await updateUserInDB(mentioned);
    } catch (error) {
        log.error(`❌ Error demoting ${mentioned.user.tag}:`, error);
        await message.reply('❌ Something went wrong while demoting the user.');
    }
};
