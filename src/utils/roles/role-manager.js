import { ROLES } from '../../config/index.js';
import { getUserRoles, syncUserToDB } from '../../database/index.js';
import log from '../logging/log.js';

/**
 * Runs a function for a single member or all members of a guild.
 * @param {import('discord.js').Guild|import('discord.js').GuildMember} target
 * @param {(member: import('discord.js').GuildMember) => Promise<void>} fn
 * @param {Object} options
 * @param {boolean} [options.skipBots=true]
 * @param {boolean} [options.skipAdmins=true]
 */
async function runForTarget(target, fn, options = { skipBots: false, skipAdmins: false }) {
    const { skipBots, skipAdmins } = options;

    const processMember = async (member) => {
        if (skipBots && member.user.bot) return;
        if (skipAdmins && member.roles.cache.has(ROLES.ADMIN.id)) return;
        await fn(member);
    };

    if (target?.members) {
        // target is guild
        await target.members.fetch();
        for (const member of target.members.cache.values()) {
            await processMember(member);
        }
    } else {
        // target is member
        await processMember(target);
    }
}

export async function assignDefaultRole(target) {
    return runForTarget(target, async (member) => {
        const tierRoleIds = Object.values(ROLES).filter(r => r.tier).map(r => r.id);
        const hasTierRole = tierRoleIds.some(roleId => member.roles.cache.has(roleId));

        if (!hasTierRole) {
            const spyRole = member.guild.roles.cache.get(ROLES.SPY.id);
            if (!spyRole) {
                log.error('ROLE MANAGER', '❌ "Foreign Spy" role not found.');
                return;
            }

            try {
                await member.roles.add(spyRole);
                await syncUserToDB(member);
                log.action_db('ROLE MANAGER', `✅ Assigned default role to ${member.user.tag}`);
            } catch (err) {
                log.error('ROLE MANAGER', `❌ Failed to assign default role to ${member.user.tag}: ${err}`);
            }
        }
    }, { skipBots: true, skipAdmins: true });
}

export async function manageTierRoles(target) {
    return runForTarget(target, async (member) => {
        const tierRoles = Object.values(ROLES).filter(r => r.tier);
        const tierRoleIds = tierRoles.map(r => r.id);

        const memberTierRoles = member.roles.cache.filter(r => tierRoleIds.includes(r.id));

        if (memberTierRoles.size > 1) {
            const sorted = [...memberTierRoles.values()].sort((a, b) => {
                const tierA = tierRoles.find(r => r.id === a.id).tier ?? 0;
                const tierB = tierRoles.find(r => r.id === b.id).tier ?? 0;
                return tierB - tierA;
            });

            const [keep, ...remove] = sorted;
            try {
                await member.roles.remove(remove);
                await syncUserToDB(member);
                log.action_db('ROLE MANAGER', `✅ Cleaned up tier roles for ${member.user.tag} (kept: ${keep.name})`);
            } catch (err) {
                log.error('ROLE MANAGER', `❌ Failed to clean tier roles for ${member.user.tag}: ${err}`);
            }
        }
    }, { skipBots: true, skipAdmins: true });
}

export async function restoreRoles(target) {
    return runForTarget(target, async (member) => {
        try {
            const currentRoles = member.roles.cache.filter(r => r.id !== member.guild.id);
            if (currentRoles.size > 0) return;

            const storedRoles = await getUserRoles(member.id);
            if (!storedRoles?.length) return;

            const botMember = await member.guild.members.fetchMe();
            const botHighestRole = botMember.roles.highest;

            const validRoles = storedRoles
                .map(nameOrId => member.guild.roles.cache.get(nameOrId) || member.guild.roles.cache.find(r => r.name === nameOrId))
                .filter(role => {
                    if (!role) return false;
                    if ([ROLES.BOT.id, ROLES.MODERATOR.id, ROLES.ADMIN.id].includes(role.id)) return false;
                    if (role.position >= botHighestRole.position) return false;
                    return true;
                });

            if (!validRoles.length) {
                log.warn('ROLE MANAGER', `No valid roles to restore for ${member.user.tag}`);
                return;
            }

            await member.roles.add(validRoles);
            await syncUserToDB(member);
            log.action_db('ROLE MANAGER', `✅ Restored roles for ${member.user.tag}`);
        } catch (err) {
            log.error('ROLE MANAGER', `❌ Failed to restore roles for ${member.user.tag}: ${err}`);
        }
    }, { skipBots: true, skipAdmins: false });
}

export async function saveRoles(member) {
    await syncUserToDB(member);
    log.action_db('ROLE MANAGER', `✅ Saved roles for ${member.user.tag}`);
}
