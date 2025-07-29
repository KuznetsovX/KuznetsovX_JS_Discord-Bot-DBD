const { ADMIN_BOT_CHANNEL } = require('../config/channels');
const { syncMembersToDB } = require('../db');
const autoAssignDefaultRole = require('../utils/auto-assign-default-role');
const autoManageTierRoles = require('../utils/auto-manage-tier-roles');
const log = require('../utils/log');

module.exports = async (client) => {
    log.action('READY', `🤖 Logged in as ${client.user.tag}`);

    const guild = client.guilds.cache.first();
    if (!guild) {
        return console.error('❌ Bot is not in any guilds.');
    }

    const channel = client.channels.cache.get(ADMIN_BOT_CHANNEL);
    if (channel) {
        channel.send('🔥 DBD.exe is now online!');
    }

    // Assign default role to all users without a tier role
    await autoAssignDefaultRole(guild);

    // Ensure full member cache, then manage tier roles
    await guild.members.fetch();
    for (const member of guild.members.cache.values()) {
        if (!member.user.bot) {
            await autoManageTierRoles(member);
        }
    }

    // Sync all current members into DB
    await syncMembersToDB(guild);
};
