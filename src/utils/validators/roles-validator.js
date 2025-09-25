/**
 * @typedef {import('../../config/roles.js').Role} Role
 */
import ROLE_CATEGORIES from '../../config/role-categories.js';

/**
 * Validate role objects
 * @param {Record<string, Role>} roles
 */
export default function validateRoles(roles) {
    const required = ["position", "id", "label", "description", "color"];
    const ALLOWED_CATEGORIES = Object.values(ROLE_CATEGORIES);

    for (const [name, role] of Object.entries(roles)) {
        const missing = required.filter(f => !(f in role));
        if (missing.length) throw new Error(`Role "${name}" is missing required field(s): ${missing.join(', ')}`);

        if ("tier" in role && typeof role.tier !== "number") {
            throw new Error(`Role "${name}" has invalid type for "tier": expected number`);
        }

        if ("category" in role && !ALLOWED_CATEGORIES.includes(role.category)) {
            throw new Error(`Role "${name}" has invalid "category": must be one of ${ALLOWED_CATEGORIES.join(', ')}`);
        }
    }
}
