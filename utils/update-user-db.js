import { User } from '../db/user-model.js';

/**
 * Updates a single user's roles and username in the database
 * @param {GuildMember} member - The Discord guild member
 */
export async function updateUserInDB(member) {
    if (!member || !member.user) return;

    const rolesString = member.roles.cache
        .filter(role => role.name !== '@everyone')
        .map(role => `${role.name} (${role.id})`)
        .join(', ');

    try {
        await User.upsert({
            userId: member.id,
            username: member.user.tag,
            roles: rolesString,
        });
        console.log(`🔄 Synced DB for ${member.user.tag}`);
    } catch (error) {
        console.error(`❌ Failed to update DB for ${member.user.tag}: ${error}`);
    }
}
