/**
 * @typedef {Object} Map
 * @property {string} image - Path to the image file
 * @property {string} label - Display name of the map
 * @property {string[]} aliases - List of alternative triggers
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
            },
            gasHeaven: {
                image: '../../assets/maps/autohaven-wreckers/Gas Heaven.png',
                label: 'Gas Heaven',
                aliases: ['GH'],
            },
            wreckersYard: {
                image: '../../assets/maps/autohaven-wreckers/Wreckers.png',
                label: 'Wreckers\' Yard',
                aliases: ['WY'],
            },
            wretchedShop: {
                image: '../../assets/maps/autohaven-wreckers/Wretched Shop.png',
                label: 'Wretched Shop',
                aliases: ['WS'],
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
            },
            coalTower: {
                image: '../../assets/maps/macmillan-estate/Coal Tower.png',
                label: 'Coal Tower',
                aliases: ['CT'],
            },
            groaningStorehouse2: {
                image: '../../assets/maps/macmillan-estate/Groaning Storehouse II.png',
                label: 'Groaning Storehouse II',
                aliases: ['GS2'],
            },
            groaningStorehouse: {
                image: '../../assets/maps/macmillan-estate/Groaning Storehouse.png',
                label: 'Groaning Storehouse',
                aliases: ['GS'],
            },
            ironworksOfMisery2: {
                image: '../../assets/maps/macmillan-estate/Ironworks Of Misery II.png',
                label: 'Ironworks Of Misery II',
                aliases: ['IOM2', 'IM2'],
            },
            ironworksOfMisery: {
                image: '../../assets/maps/macmillan-estate/Ironworks Of Misery.png',
                label: 'Ironworks Of Misery',
                aliases: ['IOM', 'IM'],
            },
            shelterWoods2: {
                image: '../../assets/maps/macmillan-estate/Shelter Woods II.png',
                label: 'Shelter Woods II',
                aliases: ['SW2'],
            },
            shelterWoods: {
                image: '../../assets/maps/macmillan-estate/Shelter Woods.png',
                label: 'Shelter Woods',
                aliases: ['SW'],
            },
            suffocationPit2: {
                image: '../../assets/maps/macmillan-estate/Suffocation Pit II.png',
                label: 'Suffocation Pit II',
                aliases: ['SP2'],
            },
            suffocationPit: {
                image: '../../assets/maps/macmillan-estate/Suffocation Pit.png',
                label: 'Suffocation Pit',
                aliases: ['SP'],
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
