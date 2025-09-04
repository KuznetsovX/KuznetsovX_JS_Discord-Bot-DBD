/**
 * @typedef {Object} Tile
 * @property {string} image - Path to the image file
 * @property {string} label - Display name of the tile
 * @property {string[]} aliases - List of alternative triggers
 */

/**
 * @typedef {Object.<string, Tile>} TileSet
 */

/** @type {TileSet} */
const TILES = {
    DoubleWindows: {
        image: '../../assets/tiles/DoubleWindows.jpg',
        label: 'Double Windows',
        aliases: ['double windows', 'doubleW', 'DW']
    },
    FourLane_InsideWindow: {
        image: '../../assets/tiles/FourLane-InsideWindow.jpg',
        label: 'Four Lane - Inside Window',
        aliases: ['four lane inside window', 'fourLaneIW', 'FLIW']
    },
    FourLane_OutsideWindow: {
        image: '../../assets/tiles/FourLane-OutsideWindow.jpg',
        label: 'Four Lane - Outside Window',
        aliases: ['four lane outside window', 'fourLaneOW', 'FLOW']
    },
    JungleGym_LongWall: {
        image: '../../assets/tiles/JungleGym-LongWall.jpg',
        label: 'Jungle Gym - Long Wall',
        aliases: ['jungle gym long wall', 'jungleGymLW', 'JGLW']
    },
    JungleGym_ShortWall: {
        image: '../../assets/tiles/JungleGym-ShortWall.jpg',
        label: 'Jungle Gym - Short Wall',
        aliases: ['jungle gym short wall', 'jungleGymSW', 'JGSW']
    },
    KillerShack: {
        image: '../../assets/tiles/KillerShack.jpg',
        label: 'Killer Shack',
        aliases: ['killer shack', 'shack']
    },
    OrmondTile: {
        image: '../../assets/tiles/OrmondTile.jpg',
        label: 'Ormond Tile',
        aliases: ['ormond tile', 'ormondTile', 'OT']
    },
    PalletGym: {
        image: '../../assets/tiles/PalletGym.jpg',
        label: 'Pallet Gym',
        aliases: ['pallet gym', 'palletGym', 'PG']
    },
    TL_Wall: {
        image: '../../assets/tiles/T-L-Walls.jpg',
        label: 'T-L Walls',
        aliases: ['t-l walls', 'tlWalls', 'TLW']
    },
    VariantGym_C: {
        image: '../../assets/tiles/VariantGymC.jpg',
        label: 'Variant Gym C',
        aliases: ['variant gym c', 'variantGymC', 'VGC']
    },
    VariantGym_Y: {
        image: '../../assets/tiles/VariantGymY.jpg',
        label: 'Variant Gym Y',
        aliases: ['variant gym y', 'variantGymY', 'VGY']
    }
};

export default TILES;
