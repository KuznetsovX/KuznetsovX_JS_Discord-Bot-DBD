import { getReadmeEmbed, CHANNELS, ROLE_EMOJIS } from '../../../config/index.js';
import { getReadmeMessage, saveReadmeMessage } from '../../../database/index.js';
import log from '../../logging/log.js';
import { ensureReactions, syncReactionsToRoles } from './reaction-utils.js';

/**
 * Initialize the Readme message with reaction roles
 * @param {Client} client
 * @param {Guild} guild
 */
export async function initReadme(client, guild) {
    const channel = guild.channels.cache.get(CHANNELS.INFO.channels.README.id);
    if (!channel) return log.warn('README ROLES', 'Readme channel not found.');

    let messageId = await getReadmeMessage();
    let message;

    if (messageId) {
        message = await channel.messages.fetch(messageId).catch(() => null);
    }

    if (!message) {
        message = await channel.send({ embeds: [getReadmeEmbed(client)] });
        await ensureReactions(message, ROLE_EMOJIS);
        await saveReadmeMessage(message.id);
        log.info('README ROLES', 'Posted new Readme message.');
    }

    client.readmeMessage = message;

    log.info('README ROLES', 'Syncing user roles based on reactions...');
    await syncReactionsToRoles(guild, message, ROLE_EMOJIS);
    log.action('README ROLES', 'Finished syncing roles from Readme reactions.');
}
