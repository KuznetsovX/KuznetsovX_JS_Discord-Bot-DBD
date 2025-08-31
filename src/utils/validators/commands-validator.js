/**
 * @typedef {import('../../config/commands.js').COMMANDS} Commands
 */

/**
 * Validate command objects
 * @param {Commands} commands
 */
export default function validateCommands(commands) {
    for (const category of Object.values(commands)) {
        for (const [name, cmd] of Object.entries(category)) {
            const required = ["file", "label", "description", "aliases", "usage", "permissions", "delete", "lock"];
            const missing = required.filter(f => !(f in cmd));
            if (missing.length) throw new Error(`Command "${name}" is missing required field(s): ${missing.join(', ')}`);

            if ("warns" in cmd && typeof cmd.warns !== "number") {
                throw new Error(`Command "${name}" has invalid type for "warns": expected number`);
            }
        }
    }
}
