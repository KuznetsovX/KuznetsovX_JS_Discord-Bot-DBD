const { sequelize, User } = require('../data/user-model');

async function syncDatabase() {
    try {
        await sequelize.sync();
        console.log('✅ Database synced successfully.');
    } catch (error) {
        console.error('❌ Error syncing the database:', error);
    }
}

async function syncMembersToDB(guild) {
    const members = await guild.members.fetch();

    for (const member of members.values()) {
        const roleNames = member.roles.cache
            .filter(role => role.name !== '@everyone')
            .map(role => `${role.name} (${role.id})`)
            .join(', ');

        console.log(`🔄 Syncing ${member.user.tag} with roles: ${roleNames}`);

        await User.upsert({
            userId: member.id,
            username: member.user.tag,
            roles: roleNames
        });
    }
}

module.exports = {
    syncDatabase,
    syncMembersToDB
};
