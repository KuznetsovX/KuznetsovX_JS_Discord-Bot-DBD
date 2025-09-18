/**
 * @typedef {import('../../config/roles.js').Role} Role
 */

/**
 * Validate role objects
 * @param {Record<string, Role>} roles
 */
export default function validateRoles(roles) {
    const required = ["position", "id", "label", "description", "color"];

    for (const [name, role] of Object.entries(roles)) {
        const missing = required.filter(f => !(f in role));
        if (missing.length) throw new Error(`Role "${name}" is missing required field(s): ${missing.join(', ')}`);

        if ("tier" in role && typeof role.tier !== "number") {
            throw new Error(`Role "${name}" has invalid type for "tier": expected number`);
        }
    }
}
