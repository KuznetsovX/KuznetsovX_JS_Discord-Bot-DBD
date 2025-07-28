const { MAIN_TEXT_CHANNEL } = require('../config/channels');
const { SPY_ROLE } = require('../config/roles');
const generateWelcomeCard = require('../utils/generate-welcome-card');
const log = require('../utils/log');
const updateUserInDB = require('../utils/update-user-db');

const assignRole = async (member) => {
    const role = member.guild.roles.cache.get(SPY_ROLE);

    if (!role) {
        log.error(`❌ "Foreign Spy" role not found for ${member.user.tag}.`);
        return false;
    }

    try {
        await member.roles.add(role);
        log.action('GUILD MEMBER ADD', `✅ Assigned "Foreign Spy" to ${member.user.tag}.`);
        return true;
    } catch (error) {
        log.error(`❌ Error assigning role for ${member.user.tag}:`, error);
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
    const channel = member.guild.channels.cache.get(MAIN_TEXT_CHANNEL);

    if (!channel) {
        log.error('❌ Channel not found.');
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

module.exports = async (member) => {
    const roleAssigned = await assignRole(member);
    if (!roleAssigned) return;

    const userSynced = await syncUser(member);
    if (!userSynced) return;

    await sendWelcomeImage(member);
};
