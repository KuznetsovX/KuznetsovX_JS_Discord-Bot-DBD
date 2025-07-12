const { ADMIN_BOT_CHANNEL } = require('../config/channels');
const autoAssignDefaultRole = require('../utils/auto-assign-default-role');
const autoManageTierRoles = require('../utils/auto-manage-tier-roles');
const log = require('../utils/log');

module.exports = async (client) => {
    log.action('READY', `🤖 Logged in as ${client.user.tag}`);

    const channel = client.channels.cache.get(ADMIN_BOT_CHANNEL);
    if (channel) {
        channel.send('🔥 DBD.exe is now online!');
    }

    const guild = client.guilds.cache.first();
    if (guild) {
        await autoAssignDefaultRole(guild);

        await guild.members.fetch();
        guild.members.cache.forEach(async (member) => {
            if (!member.user.bot) {
                await autoManageTierRoles(member);
            }
        });
    }
};
