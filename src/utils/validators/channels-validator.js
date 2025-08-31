/**
 * @typedef {import('../../config/channels.js').CHANNELS} Channels
 */

/**
 * Validate channel objects
 * @param {Channels} channels
 */
export default function validateChannels(channels) {
    for (const [name, channel] of Object.entries(channels)) {
        const required = ["type", "id", "label"];
        const missing = required.filter(f => !(f in channel));
        if (missing.length) throw new Error(`Channel "${name}" is missing required field(s): ${missing.join(', ')}`);
    }
}
