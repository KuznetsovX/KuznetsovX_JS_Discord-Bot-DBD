import { Meta } from '../connection/index.js';

export async function saveReadmeMessage(messageId) {
    await Meta.upsert({ key: 'readme_message_id', value: messageId });
}

export async function getReadmeMessage() {
    const record = await Meta.findOne({
        where: { key: 'readme_message_id' }
    });
    return record ? record.value : null;
}
