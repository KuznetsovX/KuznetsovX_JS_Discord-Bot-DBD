/**
 * @typedef {import('../../config/maps.js').MapSet} MapSet
 */

/**
 * Validate map objects
 * @param {MapSet} maps
 */
export default function validateMaps(maps) {
    for (const [realmKey, realm] of Object.entries(maps)) {
        if (!("label" in realm)) {
            throw new Error(`Realm "${realmKey}" is missing required field: label`);
        }
        if (!("maps" in realm)) {
            throw new Error(`Realm "${realmKey}" is missing required field: maps`);
        }

        for (const [mapKey, map] of Object.entries(realm.maps)) {
            const required = ["image", "label", "aliases"];
            const missing = required.filter(f => !(f in map));
            if (missing.length) {
                throw new Error(`Map "${mapKey}" in realm "${realmKey}" is missing required field(s): ${missing.join(', ')}`);
            }

            if (!Array.isArray(map.aliases)) {
                throw new Error(`Map "${mapKey}" in realm "${realmKey}" has invalid type for "aliases": expected array`);
            }
        }
    }
}
