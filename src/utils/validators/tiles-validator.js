/**
 * @typedef {import('../../config/tiles.js').TileSet} TileSet
 */

/**
 * Validate tile objects
 * @param {TileSet} tiles
 */
export default function validateTiles(tiles) {
    for (const [tileKey, tile] of Object.entries(tiles)) {
        const required = ["image", "label", "aliases"];
        const missing = required.filter(f => !(f in tile));
        if (missing.length) {
            throw new Error(`Tile "${tileKey}" is missing required field(s): ${missing.join(', ')}`);
        }

        if (!Array.isArray(tile.aliases)) {
            throw new Error(`Tile "${tileKey}" has invalid type for "aliases": expected array`);
        }
    }
}
