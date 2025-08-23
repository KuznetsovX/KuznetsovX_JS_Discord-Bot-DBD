import config from '../config/index.js';
import { User } from '../db/user-model.js';
import generateWelcomeCard from '../utils/generate-welcome-card.js';
import log from '../utils/logging/log.js';
import { restoreUserRoles } from '../utils/roles/restore-user-roles.js';
import { syncUserToDB } from '../db/utils/sync-user-to-db.js';

const assignDefaultRole = async (member) => {
    const role = member.guild.roles.cache.get(config.ROLES.SPY);

    if (!role) {
        log.error('GUILD MEMBER ADD', `❌ "Foreign Spy" role not found for ${member.user.tag}.`);
        return false;
    }

    try {
        await member.roles.add(role);
        log.action('GUILD MEMBER ADD', `✅ Assigned "Foreign Spy" to ${member.user.tag}.`);
        return true;
    } catch (error) {
        log.error('GUILD MEMBER ADD', `❌ Error assigning default role for ${member.user.tag}:`, error);
        return false;
    }
};

const restoreRoles = async (member) => {
    try {
        return await restoreUserRoles(member);
    } catch (error) {
        log.error('GUILD MEMBER ADD', `❌ Error restoring roles for ${member.user.tag}:`, error);
        return false;
    }
};

const syncUser = async (member) => {
    try {
        await syncUserToDB(member);
        log.action('GUILD MEMBER ADD', `✅ Synced ${member.user.tag} to the database.`);
        return true;
    } catch (error) {
        log.error('GUILD MEMBER ADD', `❌ Error syncing DB for ${member.user.tag}:`, error);
        return false;
    }
};

const sendWelcomeImage = async (member) => {
    const channel = member.guild.channels.cache.get(config.CHANNELS.MAIN.TEXT);

    if (!channel) {
        log.error('GUILD MEMBER ADD', `❌ Main text channel not found.`);
        return;
    }

    try {
        const card = await generateWelcomeCard(member);
        await channel.send({
            content: `<@${member.id}>`,
            files: [card]
        });
        log.action('GUILD MEMBER ADD', `✅ Sent welcome card to ${member.user.tag}.`);
    } catch (error) {
        log.error('GUILD MEMBER ADD', `❌ Failed to send welcome card for ${member.user.tag}:`, error);
    }
};

export default async function guildMemberAdd(member) {
    const existsInDB = await User.findOne({ where: { userId: member.id } });

    if (existsInDB) {
        await restoreRoles(member);
    } else {
        const defaultAssigned = await assignDefaultRole(member);
        if (!defaultAssigned) return;

        await sendWelcomeImage(member);
    }

    await syncUser(member);
}
