import { Meta } from '../connection/index.js';

/**
 * Save a message ID into Meta by key
 * @param {string} key - The metadata key
 * @param {string} messageId - The Discord message ID to save
 */
export async function saveMessageMetadata(key, messageId) {
    await Meta.upsert({ key, value: messageId });
}

/**
 * Retrieve a message ID from Meta by key
 * @param {string} key - The metadata key
 * @returns {Promise<string|null>} The stored message ID or null if not found
 */
export async function getMessageMetadata(key) {
    const record = await Meta.findOne({ where: { key } });
    return record ? record.value : null;
}

export async function saveInviteMessage(messageId) {
    return saveMessageMetadata('invite_message_id', messageId);
}

export async function getInviteMessage() {
    return getMessageMetadata('invite_message_id');
}

export async function saveReadmeMessage(messageId) {
    return saveMessageMetadata('readme_message_id', messageId);
}

export async function getReadmeMessage() {
    return getMessageMetadata('readme_message_id');
}
