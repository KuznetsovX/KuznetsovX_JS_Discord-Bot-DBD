import { Op } from 'sequelize';
import { User } from '../connection/index.js';
import log from '../../utils/logging/log.js';

/**
 * Updates a single user's roles and username in the database
 * @param {import('discord.js').GuildMember} member - The Discord guild member
 */
export async function syncUserToDB(member) {
    if (!member || !member.user) return;

    const roleIds = member.roles.cache
        .filter(role => role.name !== '@everyone')
        .map(role => role.id);

    const roleNames = member.roles.cache
        .filter(role => role.name !== '@everyone')
        .map(role => role.name);

    try {
        await User.upsert({
            userId: member.id,
            username: member.user.tag,
            roleIds: roleIds.length ? roleIds.join(',') : '',
            roles: roleNames.length ? roleNames.join(', ') : 'No roles',
        });
        log.action_db('SYNC USER TO DB', `🔄 Synced DB for ${member.user.tag}`);
    } catch (error) {
        log.error('SYNC USER TO DB', `❌ Failed to sync DB for ${member.user.tag}: ${error.message}`, error);
    }
}

/**
 * Sync all members of a guild into the database
 * @param {import('discord.js').Guild} guild - The Discord guild
 */
export async function syncMembersToDB(guild) {
    if (!guild) return;

    const members = guild.members.cache;
    for (const member of members.values()) {
        await syncUserToDB(member);
    }

    log.action_db('SYNC MEMBERS TO DB', `✅ Synced ${members.size} members to the database`);
}

/**
 * Removes a single user from the database
 * @param {import('discord.js').GuildMember|string|{id: string, tag?: string}} memberOrId - The Discord guild member, their ID, or an object with `id` and optional `tag`
 */
export async function removeUserFromDB(memberOrId) {
    if (!memberOrId) return;

    let userId;
    let tag = 'Unknown';

    if (typeof memberOrId === 'string') {
        userId = memberOrId;
    } else if (memberOrId.user) {
        userId = memberOrId.id;
        tag = memberOrId.user.tag;
    } else if (memberOrId.id) {
        userId = memberOrId.id;
        tag = memberOrId.tag || 'Unknown';
    } else {
        return;
    }

    try {
        const deleted = await User.destroy({ where: { userId } });

        if (deleted) {
            log.action_db('REMOVE USER FROM DB', `🗑️ Removed ${tag} (Discord ID: ${userId}) from the database`);
        } else {
            log.warn('REMOVE USER FROM DB', `User ${tag} (Discord ID: ${userId}) not found in database`);
        }
    } catch (error) {
        log.error('REMOVE USER FROM DB', `❌ Failed to remove ${tag} (Discord ID: ${userId}): ${error.message}`, error);
    }
}

/**
 * Removes all users from the database for a given guild
 * @param {import('discord.js').Guild} guild - The Discord guild
 */
export async function removeMembersFromDB(guild) {
    if (!guild) return;

    const members = guild.members.cache.filter(m => !m.user.bot);
    const memberIds = members.map(m => m.id);

    if (memberIds.length === 0) return;

    try {
        const deleted = await User.destroy({
            where: { userId: { [Op.in]: memberIds } }
        });
        log.action_db('REMOVE ALL USERS FROM DB', `🗑️ Removed ${deleted} members from the database`);
    } catch (error) {
        log.error('REMOVE ALL USERS FROM DB', `❌ Failed to remove members: ${error.message}`, error);
    }
}
