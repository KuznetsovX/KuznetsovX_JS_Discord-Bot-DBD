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
    try {
        await guild.members.fetch(); // Ensure full member cache

        for (const [memberId, member] of guild.members.cache) {
            await User.findOrCreate({
                where: { userId: memberId },
                defaults: {
                    username: member.user.tag,
                    roles: member.roles.cache
                        .filter(role => role.name !== '@everyone')
                        .map(role => role.name)
                        .join(', '),
                },
            });
        }

        console.log(`✅ Synced ${guild.memberCount} members to the database.`);
    } catch (error) {
        console.error('❌ Error syncing existing members:', error);
    }
}

module.exports = {
    syncDatabase,
    syncMembersToDB
};
