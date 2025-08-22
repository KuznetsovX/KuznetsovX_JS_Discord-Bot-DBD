import { sequelize, User } from './user-model.js';
import log from '../utils/logging/log.js';

export async function syncDatabase() {
    try {
        await sequelize.sync();
        log.action(`DATABASE`, `✅ Database schema synchronized successfully.`);
    } catch (error) {
        log.error(`DATABASE`, `❌ Error synchronizing database schema: ${error.message}`, error);
    }
}

export async function syncMembersToDB(guild) {
    try {
        const members = await guild.members.fetch();

        for (const member of members.values()) {
            const roleNames = member.roles.cache
                .filter(role => role.name !== '@everyone')
                .map(role => `${role.name} (${role.id})`)
                .join(', ');

            log.action(`DATABASE`, `🔄 Syncing ${member.user.tag} with roles: ${roleNames}`);

            await User.upsert({
                userId: member.id,
                username: member.user.tag,
                roles: roleNames
            });
        }
    } catch (error) {
        log.error(`DATABASE`, `❌ Failed to sync members for guild ${guild.id}: ${error.message}`, error);
    }
}

export async function getUserRoles(userId) {
    try {
        const user = await User.findOne({ where: { userId } });
        if (!user || !user.roles) return [];

        const roles = user.roles
            .split(', ')
            .map(entry => {
                const match = entry.match(/\((\d+)\)$/);
                return match ? match[1] : null;
            })
            .filter(Boolean);

        return roles;
    } catch (error) {
        log.error(`DATABASE`, `❌ Failed to get roles for userId ${userId}: ${error.message}`, error);
        return [];
    }
}
