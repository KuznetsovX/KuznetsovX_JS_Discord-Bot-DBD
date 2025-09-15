/**
 * Check if a member has the required permissions to run a command
 * @param {import('discord.js').GuildMember} member - The Discord guild member
 * @param {string[]} requiredRoles - Array of role IDs from config
 * @returns {boolean}
 */
export function hasPermission(member, requiredRoles) {
    // If no roles are required - anyone can use it
    if (!requiredRoles || requiredRoles.length === 0) return true;
    if (!member) return false;

    // Check if the member has at least one of the required roles
    return member.roles.cache.some(role => requiredRoles.includes(role.id));
}
