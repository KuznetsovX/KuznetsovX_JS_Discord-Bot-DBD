import { Meta } from '../connection/index.js';

export async function saveInviteMessage(messageId) {
    await Meta.upsert({ key: 'invite_message_id', value: messageId });
}

export async function getInviteMessage() {
    const record = await Meta.findOne({
        where: { key: 'invite_message_id' }
    });
    return record ? record.value : null;
}
