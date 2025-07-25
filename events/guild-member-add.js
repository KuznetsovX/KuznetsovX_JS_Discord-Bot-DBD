const { SPY_ROLE } = require('../config/roles');
const log = require('../utils/log');
const updateUserInDB = require('../utils/update-user-db');

module.exports = async (member) => {
    const role = member.guild.roles.cache.get(SPY_ROLE);

    if (!role) {
        log.error(`❌ "Foreign Spy" role not found for ${member.user.tag}.`);
        return;
    }

    try {
        // Add the "Foreign Spy" role to the new member
        await member.roles.add(role);
        log.action('GUILD MEMBER ADD', `✅ Auto-assigned "Foreign Spy" to ${member.user.tag}.`);

        // Sync the new member with the database
        await updateUserInDB(member);

        log.action('GUILD MEMBER ADD', `✅ Refreshed database with member ${member.user.tag}.`);
    } catch (error) {
        log.error(`❌ Error processing member join for ${member.user.tag}:`, error);
    }
};
