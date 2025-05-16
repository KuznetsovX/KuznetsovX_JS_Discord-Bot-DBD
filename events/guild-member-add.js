const { SPY_ROLE } = require('../config/roles');
const log = require('../utils/log');

module.exports = (member) => {
    const role = member.guild.roles.cache.get(SPY_ROLE);

    if (!role) {
        log.error(`❌ "Foreign Spy" role not found for ${member.user.tag}.`);
        return;
    }

    member.roles.add(role)
        .then(() => {
            log.action('GUILD MEMBER ADD', `✅ Auto-assigned "Foreign Spy" to ${member.user.tag}.`);
        })
        .catch((error) => {
            log.error(`❌ Error assigning "Foreign Spy" role to ${member.user.tag}:`, error);
        });
};
