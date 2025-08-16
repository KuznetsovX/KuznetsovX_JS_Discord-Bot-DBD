import { CHANNELS } from '../config/channels.js';
import { ROLES } from '../config/roles.js';
import { User } from '../db/user-model.js';
import generateWelcomeCard from '../utils/generate-welcome-card.js';
import log from '../utils/logging/log.js';
import { restoreUserRoles } from '../utils/roles/restore-user-roles.js';
import { updateUserInDB } from '../db/utils/update-user-db.js';

const assignDefaultRole = async (member) => {
    const role = member.guild.roles.cache.get(ROLES.SPY);

    if (!role) {
        log.error(`❌ "Foreign Spy" role not found for ${member.user.tag}.`);
        return false;
    }

    try {
        await member.roles.add(role);
        log.action('GUILD MEMBER ADD', `✅ Assigned "Foreign Spy" to ${member.user.tag}.`);
        return true;
    } catch (error) {
        log.error(`❌ Error assigning default role for ${member.user.tag}:`, error);
        return false;
    }
};

const restoreRoles = async (member) => {
    try {
        return await restoreUserRoles(member);
    } catch (error) {
        log.error(`❌ Error restoring roles for ${member.user.tag}:`, error);
        return false;
    }
};

const syncUser = async (member) => {
    try {
        await updateUserInDB(member);
        log.action('GUILD MEMBER ADD', `✅ Synced ${member.user.tag} to the database.`);
        return true;
    } catch (error) {
        log.error(`❌ Error syncing DB for ${member.user.tag}:`, error);
        return false;
    }
};

const sendWelcomeImage = async (member) => {
    const channel = member.guild.channels.cache.get(CHANNELS.MAIN.TEXT);

    if (!channel) {
        log.error('❌ Main text channel not found.');
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
        log.error(`❌ Failed to send welcome card for ${member.user.tag}:`, error);
    }
};

export default async function guildMemberAdd(member) {
    const rolesRestored = await restoreRoles(member);
    if (!rolesRestored) {
        const defaultAssigned = await assignDefaultRole(member);
        if (!defaultAssigned) return;
    }

    const userSynced = await syncUser(member);
    if (!userSynced) return;

    const existsInDB = await User.findOne({ where: { userId: member.id } });
    if (!existsInDB) {
        await sendWelcomeImage(member);
    }
};
