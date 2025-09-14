/**
 * @typedef {import('discord.js').ActivityType} ActivityType
 * @typedef {{
 *   status: string,
 *   activity?: {
 *     type: ActivityType,
 *     name: string
 *   } | null
 * }} Presence
 */

/**
 * Validate presence objects
 * @param {Record<string, Presence>} presences
 */
export default function validatePresences(presences) {
    const validStatuses = ["online", "idle", "dnd", "invisible"];

    for (const [name, presence] of Object.entries(presences)) {
        // status validation
        if (!presence.status || !validStatuses.includes(presence.status)) {
            throw new Error(`Presence "${name}" has invalid or missing "status": expected one of ${validStatuses.join(", ")}`);
        }

        // activity validation
        if (presence.activity === null) continue; // allow null

        if (presence.activity) {
            const { type, name: actName } = presence.activity;

            if (typeof type !== "number") {
                throw new Error(`Presence "${name}" has invalid "activity.type": expected ActivityType (number)`);
            }

            if (typeof actName !== "string") {
                throw new Error(`Presence "${name}" has invalid "activity.name": must be a string`);
            }

        }
    }
}
