/**
 * @typedef {import('../../config/channels.js').CHANNELS} Channels
 */

/**
 * Validate channel objects
 * @param {Channels} channels
 */
export default function validateChannels(channels) {
    for (const [catKey, category] of Object.entries(channels)) {
        if (!category.channels || typeof category.channels !== 'object') {
            throw new Error(`Category "${category.label || catKey}" is missing a "channels" object`);
        }

        for (const [chanKey, chan] of Object.entries(category.channels)) {
            const required = ['type', 'id', 'label'];
            const missing = required.filter(f => !(f in chan));
            if (missing.length) {
                throw new Error(`Channel "${chanKey}" in category "${category.label || catKey}" is missing required field(s): ${missing.join(', ')}`);
            }

            if (chan.type !== 'TEXT' && chan.type !== 'VOICE') {
                throw new Error(`Channel "${chanKey}" in category "${category.label || catKey}" has invalid type "${chan.type}", expected "TEXT" or "VOICE"`);
            }
        }
    }
}
