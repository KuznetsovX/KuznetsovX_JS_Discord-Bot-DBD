/**
 * @typedef {Object} Map
 * @property {string} image - Path to the image file
 * @property {string} label - Display name of the map
 * @property {string[]} aliases - List of alternative triggers
 * @property {string[]} [alts] - Optional list of alternative map keys for this map
 * @property {boolean} [alt=false] - Whether this map is an alternate/DBDL version
 */

/**
 * @typedef {Object.<string, Map>} MapSet
 */

/** @type {MapSet} */
const MAPS = {
    autohavenWreckers: {
        label: 'Autohaven Wreckers',
        maps: {
            azarovsRestingPlace: {
                image: '../../assets/maps/autohaven-wreckers/Azarovs Resting Place.png',
                label: 'Azarov\'s Resting Place',
                aliases: ['ARP'],
            },
            bloodLodge: {
                image: '../../assets/maps/autohaven-wreckers/Blood Lodge.png',
                label: 'Blood Lodge',
                aliases: ['BL'],
                alts: ['bloodLodgeDBDL'],
            },
            bloodLodgeDBDL: {
                image: '../../assets/maps/autohaven-wreckers/DBDLEAGUE_BLOOD_LODGE_4K.png',
                label: 'Blood Lodge DBDL',
                aliases: ['BL_DBDL'],
                alt: true,
            },
            gasHeaven: {
                image: '../../assets/maps/autohaven-wreckers/Gas Heaven.png',
                label: 'Gas Heaven',
                aliases: ['GH'],
                alts: ['gasHeavenDBDL'],
            },
            gasHeavenDBDL: {
                image: '../../assets/maps/autohaven-wreckers/DBDLEAGUE_GAS_HEAVEN_4K.png',
                label: 'Gas Heaven DBDL',
                aliases: ['GH_DBDL'],
                alt: true,
            },
            wreckersYard: {
                image: '../../assets/maps/autohaven-wreckers/Wreckers.png',
                label: 'Wreckers\' Yard',
                aliases: ['WY'],
                alts: ['wreckersYardDBDL'],
            },
            wreckersYardDBDL: {
                image: '../../assets/maps/autohaven-wreckers/DBDLEAGUE_WRECKERS_YARD_4K.png',
                label: 'Wreckers\' Yard DBDL',
                aliases: ['WY_DBDL'],
                alt: true,
            },
            wretchedShop: {
                image: '../../assets/maps/autohaven-wreckers/Wretched Shop.png',
                label: 'Wretched Shop',
                aliases: ['WS'],
                alts: ['wretchedShopDBDL'],
            },
            wretchedShopDBDL: {
                image: '../../assets/maps/autohaven-wreckers/DBDLEAGUE_WRETCHED_SHOP_4K.png',
                label: 'Wretched Shop DBDL',
                aliases: ['WS_DBDL'],
                alt: true,
            },
        },
    },
    backwaterSwamp: {
        label: 'Backwater Swamp',
        maps: {
            grimPantry: {
                image: '../../assets/maps/backwater-swamp/Grim Pantry.png',
                label: 'Grim Pantry',
                aliases: ['GP'],
            },
            thePaleRose: {
                image: '../../assets/maps/backwater-swamp/Pale Rose.png',
                label: 'The Pale Rose',
                aliases: ['TPR', 'PR'],
            },
        },
    },
    coldwindFarm: {
        label: 'Coldwind Farm',
        maps: {
            fracturedCowshed: {
                image: '../../assets/maps/coldwind-farm/Fractured Cowshed.png',
                label: 'Fractured Cowshed',
                aliases: ['FC'],
            },
            rancidAbbatoir: {
                image: '../../assets/maps/coldwind-farm/Rancid Abbatoir.png',
                label: 'Rancid Abbatoir',
                aliases: ['RA'],
            },
            rottenFields: {
                image: '../../assets/maps/coldwind-farm/Rotten Fields.png',
                label: 'Rotten Fields',
                aliases: ['RF'],
            },
            theThompsonHouse: {
                image: '../../assets/maps/coldwind-farm/The Thompson House.png',
                label: 'The Thompson House',
                aliases: ['TTH', 'TH'],
            },
            tormentCreek: {
                image: '../../assets/maps/coldwind-farm/Torment Creek.png',
                label: 'Torment Creek',
                aliases: ['TC'],
            },
        },
    },
    crotusPrennAsylum: {
        label: 'Crotus Prenn Asylum',
        maps: {
            disturbedWard: {
                image: '../../assets/maps/crotus-prenn-asylum/Disturbed Ward.png',
                label: 'Disturbed Ward',
                aliases: ['DW'],
            },
            fatherCampbellsChapel: {
                image: '../../assets/maps/crotus-prenn-asylum/Father Campbells Chapel.png',
                label: 'Father Campbell\'s Chapel',
                aliases: ['FCC'],
            },
        },
    },
    theDecimatedBorgo: {
        label: 'The Decimated Borgo',
        maps: {
            forgottenRuins: {
                image: '../../assets/maps/decimated-borgo/Forgotten Ruins.png',
                label: 'Forgotten Ruins',
                aliases: ['FR'],
            },
            theShatteredSquare: {
                image: '../../assets/maps/decimated-borgo/Shattered Square.png',
                label: 'The Shattered Square',
                aliases: ['TSS', 'SS'],
            },
        },
    },
    dvarkaDeepwood: {
        label: 'Dvarka Deepwood',
        maps: {
            nostromoWreckage: {
                image: '../../assets/maps/dvarka-deepwood/Nostromo Wreckage.png',
                label: 'Nostromo Wreckage',
                aliases: ['NW'],
            },
            tobaLanding: {
                image: '../../assets/maps/dvarka-deepwood/Toba Landing.png',
                label: 'Toba Landing',
                aliases: ['TL'],
            },
        },
    },
    forsakenBoneyard: {
        label: 'Forsaken Boneyard',
        maps: {
            deadSands: {
                image: '../../assets/maps/forsaken-boneyard/Dead Sands.png',
                label: 'Dead Sands',
                aliases: ['DS'],
            },
            eyrieOfCrows: {
                image: '../../assets/maps/forsaken-boneyard/Eyrie of Crows.png',
                label: 'Eyrie of Crows',
                aliases: ['EOC', 'EC'],
            },
        },
    },
    gideonMeatPlant: {
        label: 'Gideon Meat Plant',
        maps: {
            theGame: {
                image: '../../assets/maps/gideon-meat-plant/The Game.png',
                label: 'The Game',
                aliases: ['TG', 'G'],
            },
        },
    },
    graveOfGlenvale: {
        label: 'Grave of Glenvale',
        maps: {
            deadDawgSaloon: {
                image: '../../assets/maps/grave-of-glenvale/Dead Dawg Saloon.png',
                label: 'Dead Dawg Saloon',
                aliases: ['DDS'],
            },
        },
    },
    haddonfield: {
        label: 'Haddonfield',
        maps: {
            lampkinLane: {
                image: '../../assets/maps/haddonfield/Haddonfield.png',
                label: 'Lampkin Lane',
                aliases: ['LL'],
            },
        },
    },
    hawkinsNationalLaboratory: {
        label: 'Hawkins National Laboratory',
        maps: {
            undergroundComplex: {
                image: '../../assets/maps/hawkins-national-laboratory/Hawkins.png',
                label: 'The Underground Complex',
                aliases: ['TUC', 'UC'],
            },
        },
    },
    lerysMemorialInstitute: {
        label: 'Lery\'s Memorial Institute',
        maps: {
            treatmentTheatre: {
                image: '../../assets/maps/lerys-memorial-institute/Lerys.png',
                label: 'Treatment Theatre',
                aliases: ['TT'],
            },
        },
    },
    theMacMillanEstate: {
        label: 'The MacMillan Estate',
        maps: {
            coalTower2: {
                image: '../../assets/maps/macmillan-estate/Coal Tower II.png',
                label: 'Coal Tower II',
                aliases: ['CT2'],
                alts: ['coalTower2DBDL'],
            },
            coalTower2DBDL: {
                image: '../../assets/maps/macmillan-estate/DBDLEAGUE_COAL_TOWER_2_4K.png',
                label: 'Coal Tower II DBDL',
                aliases: ['CT2_DBDL'],
                alt: true,
            },
            coalTower: {
                image: '../../assets/maps/macmillan-estate/Coal Tower.png',
                label: 'Coal Tower',
                aliases: ['CT'],
                alts: ['coalTowerDBDL'],
            },
            coalTowerDBDL: {
                image: '../../assets/maps/macmillan-estate/DBDLEAGUE_COAL_TOWER_1_4K_1.png',
                label: 'Coal Tower DBDL',
                aliases: ['CT_DBDL'],
                alt: true,
            },
            groaningStorehouse2: {
                image: '../../assets/maps/macmillan-estate/Groaning Storehouse II.png',
                label: 'Groaning Storehouse II',
                aliases: ['GS2'],
                alts: ['groaningStorehouse2DBDL'],
            },
            groaningStorehouse2DBDL: {
                image: '../../assets/maps/macmillan-estate/DBDLEAGUE_GROANING_STOREHOUSE_2_4K.png',
                label: 'Groaning Storehouse II DBDL',
                aliases: ['GS2_DBDL'],
                alt: true,
            },
            groaningStorehouse: {
                image: '../../assets/maps/macmillan-estate/Groaning Storehouse.png',
                label: 'Groaning Storehouse',
                aliases: ['GS'],
                alts: ['groaningStorehouseDBDL'],
            },
            groaningStorehouseDBDL: {
                image: '../../assets/maps/macmillan-estate/DBDLEAGUE_GROANING_STOREHOUSE_1_4K.png',
                label: 'Groaning Storehouse DBDL',
                aliases: ['GS_DBDL'],
                alt: true,
            },
            ironworksOfMisery2: {
                image: '../../assets/maps/macmillan-estate/Ironworks Of Misery II.png',
                label: 'Ironworks Of Misery II',
                aliases: ['IOM2', 'IM2'],
                alts: ['ironworksOfMisery2DBDL'],
            },
            ironworksOfMisery2DBDL: {
                image: '../../assets/maps/macmillan-estate/DBDLEAGUE_IRONWORKS_OF_MISERY_2_4K.png',
                label: 'Ironworks Of Misery II DBDL',
                aliases: ['IOM2_DBDL', 'IM2_DBDL'],
                alt: true,
            },
            ironworksOfMisery: {
                image: '../../assets/maps/macmillan-estate/Ironworks Of Misery.png',
                label: 'Ironworks Of Misery',
                aliases: ['IOM', 'IM'],
                alts: ['ironworksOfMiseryDBDL'],
            },
            ironworksOfMiseryDBDL: {
                image: '../../assets/maps/macmillan-estate/DBDLEAGUE_IRONWORKS_OF_MISERY_1_4K.png',
                label: 'Ironworks Of Misery DBDL',
                aliases: ['IOM_DBDL', 'IM_DBDL'],
                alt: true,
            },
            shelterWoods2: {
                image: '../../assets/maps/macmillan-estate/Shelter Woods II.png',
                label: 'Shelter Woods II',
                aliases: ['SW2'],
                alts: ['shelterWoods2DBDL'],
            },
            shelterWoods2DBDL: {
                image: '../../assets/maps/macmillan-estate/DBDLEAGUE_SHELTER_WOODS_2_4K.png',
                label: 'Shelter Woods II DBDL',
                aliases: ['SW2_DBDL'],
                alt: true,
            },
            shelterWoods: {
                image: '../../assets/maps/macmillan-estate/Shelter Woods.png',
                label: 'Shelter Woods',
                aliases: ['SW'],
                alts: ['shelterWoodsDBDL'],
            },
            shelterWoodsDBDL: {
                image: '../../assets/maps/macmillan-estate/DBDLEAGUE_SHELTER_WOODS_1_4K.png',
                label: 'Shelter Woods DBDL',
                aliases: ['SW_DBDL'],
                alt: true,
            },
            suffocationPit2: {
                image: '../../assets/maps/macmillan-estate/Suffocation Pit II.png',
                label: 'Suffocation Pit II',
                aliases: ['SP2'],
                alts: ['suffocationPit2DBDL'],
            },
            suffocationPit2DBDL: {
                image: '../../assets/maps/macmillan-estate/DBDLEAGUE_SUFFOCATION_PIT_2_4K.png',
                label: 'Suffocation Pit II DBDL',
                aliases: ['SP2_DBDL'],
                alt: true,
            },
            suffocationPit: {
                image: '../../assets/maps/macmillan-estate/Suffocation Pit.png',
                label: 'Suffocation Pit',
                aliases: ['SP'],
                alts: ['suffocationPitDBDL'],
            },
            suffocationPitDBDL: {
                image: '../../assets/maps/macmillan-estate/DBDLEAGUE_SUFFOCATION_PIT_1_4K.png',
                label: 'Suffocation Pit DBDL',
                aliases: ['SP_DBDL'],
                alt: true,
            },
        },
    },
    ormond: {
        label: 'Ormond',
        maps: {
            lakeMine: {
                image: '../../assets/maps/ormond/Lake Mine.png',
                label: 'Ormond Lake Mine',
                aliases: ['OLM', 'LM'],
            },
            ormond2: {
                image: '../../assets/maps/ormond/Ormond II.png',
                label: 'Mount Ormond Resort II',
                aliases: ['MOR2'],
            },
            ormond3: {
                image: '../../assets/maps/ormond/Ormond III.png',
                label: 'Mount Ormond Resort III',
                aliases: ['MOR3'],
            },
            ormond: {
                image: '../../assets/maps/ormond/Ormond.jpg',
                label: 'Mount Ormond Resort',
                aliases: ['MOR'],
            },
        },
    },
    raccoonCity: {
        label: 'Raccoon City',
        maps: {
            raccoonCityPoliceStationEastWing: {
                image: '../../assets/maps/raccoon-city/Rpd East Wing.png',
                label: 'Raccoon City Police Station East Wing',
                aliases: ['RPDEW', 'RPDE'],
            },
            raccoonCityPoliceStationWestWing: {
                image: '../../assets/maps/raccoon-city/Rpd West Wing.png',
                label: 'Raccoon City Police Station West Wing',
                aliases: ['RPDWW', 'RPDW'],
            },
        },
    },
    redForest: {
        label: 'Red Forest',
        maps: {
            mothersDwelling: {
                image: '../../assets/maps/red-forest/Mothers Dwelling.png',
                label: 'Mother\'s Dwelling',
                aliases: ['MD'],
            },
            theTempleOfPurgation: {
                image: '../../assets/maps/red-forest/Temple of Purgation.png',
                label: 'The Temple of Purgation',
                aliases: ['TTOP', 'TOP', 'TP'],
            },
        },
    },
    silentHill: {
        label: 'Silent Hill',
        maps: {
            midwichElementarySchool: {
                image: '../../assets/maps/silent-hill/Midwich.png',
                label: 'Midwich Elementary School',
                aliases: ['MES'],
            },
        },
    },
    springwood: {
        label: 'Springwood',
        maps: {
            badhamPreschool: {
                image: '../../assets/maps/springwood/Preschool1.png',
                label: 'Badham Preschool',
                aliases: ['BP'],
            },
            badhamPreschool2: {
                image: '../../assets/maps/springwood/Preschool2.png',
                label: 'Badham Preschool II',
                aliases: ['BP2'],
            },
            badhamPreschool3: {
                image: '../../assets/maps/springwood/Preschool3.png',
                label: 'Badham Preschool III',
                aliases: ['BP3'],
            },
            badhamPreschool4: {
                image: '../../assets/maps/springwood/Preschool4.png',
                label: 'Badham Preschool IV',
                aliases: ['BP4'],
            },
            badhamPreschool5: {
                image: '../../assets/maps/springwood/Preschool5.png',
                label: 'Badham Preschool V',
                aliases: ['BP5'],
            },
        },
    },
    witheredIsle: {
        label: 'Withered Isle',
        maps: {
            fallenRefuge: {
                image: '../../assets/maps/withered-isle/Fallen Refuge.png',
                label: 'Fallen Refuge',
                aliases: ['FREF'],
            },
            freddyFazbearsPizza: {
                image: '../../assets/maps/withered-isle/Freddy Fazbears Pizza.png',
                label: 'Freddy Fazbear\'s Pizza',
                aliases: ['FFP'],
            },
            gardenOfJoy: {
                image: '../../assets/maps/withered-isle/Garden of Joy.png',
                label: 'Garden of Joy',
                aliases: ['GOJ', 'GJ'],
            },
            greenvilleSquare: {
                image: '../../assets/maps/withered-isle/Greenville Square.png',
                label: 'Greenville Square',
                aliases: ['GSQ'],
            },
        },
    },
    yamaokaEstate: {
        label: 'Yamaoka Estate',
        maps: {
            familyResidence2: {
                image: '../../assets/maps/yamaoka-estate/Family Residence II.png',
                label: 'Family Residence II',
                aliases: ['FRES2'],
            },
            familyResidence: {
                image: '../../assets/maps/yamaoka-estate/Family Residence.png',
                label: 'Family Residence',
                aliases: ['FRES'],
            },
            sanctumOfWrath2: {
                image: '../../assets/maps/yamaoka-estate/Sanctum of Wrath II.png',
                label: 'Sanctum of Wrath II',
                aliases: ['SOW2', 'SWR2'],
            },
            sanctumOfWrath: {
                image: '../../assets/maps/yamaoka-estate/Sanctum of Wrath.jpg',
                label: 'Sanctum of Wrath',
                aliases: ['SOW', 'SWR'],
            },
        },
    },
};

export default MAPS;
