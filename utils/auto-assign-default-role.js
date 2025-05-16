const { SPY_ROLE, ROLE_TIERS, ADMIN_ROLE } = require('../config/roles');
const log = require('./log');

async function assignDefaultRole(guild) {
    const spyRole = guild.roles.cache.get(SPY_ROLE);
    if (!spyRole) {
        log.error('AUTO ASSIGN DEFAULT ROLE', `"Foreign Spy" role not found.`);
        return;
    }

    await guild.members.fetch();

    guild.members.cache.forEach(member => {
        if (member.user.bot) return;
        if (member.roles.cache.has(ADMIN_ROLE)) return;

        const hasTierRole = ROLE_TIERS.some(roleId => member.roles.cache.has(roleId));

        if (!hasTierRole) {
            member.roles.add(spyRole)
                .then(() => {
                    log.action('AUTO ASSIGN DEFAULT ROLE', `Auto-assigned "Foreign Spy" to ${member.user.tag}.`);
                })
                .catch(error => {
                    log.error('AUTO ASSIGN DEFAULT ROLE', `Failed to assign "Foreign Spy" to ${member.user.tag}: ${error}`);
                });
        }
    });
}

module.exports = assignDefaultRole;
