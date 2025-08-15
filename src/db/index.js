import { sequelize, User } from './user-model.js';

export async function syncDatabase() {
    try {
        await sequelize.sync();
        console.log('✅ Database synced successfully.');
    } catch (error) {
        console.error('❌ Error syncing the database:', error);
    }
}

export async function syncMembersToDB(guild) {
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

export async function getUserRoles(userId) {
    try {
        const user = await User.findOne({ where: { userId } });
        if (!user || !user.roles) return [];

        const roles = user.roles.split(', ').map(entry => {
            const match = entry.match(/\((\d+)\)$/);
            return match ? match[1] : null;
        }).filter(Boolean);

        return roles;
    } catch (error) {
        console.error('❌ Failed to get user roles:', error);
        return [];
    }
}
