import dotenv from 'dotenv';
dotenv.config();

import CHANNELS from './channels.js';
import COMMANDS from './commands.js';
import MAPS from './maps.js';
import PRESENCES from './presence.js';
import ROLES from './roles.js';
import TILES from './tiles.js';

import validateChannels from '../utils/validators/channels-validator.js';
import validateCommands from '../utils/validators/commands-validator.js';
import validateMaps from '../utils/validators/maps-validator.js';
import validatePresence from '../utils/validators/presence-validator.js';
import validateRoles from '../utils/validators/roles-validator.js';
import validateTiles from '../utils/validators/tiles-validator.js';

validateChannels(CHANNELS);
validateCommands(COMMANDS);
validateMaps(MAPS);
validatePresence(PRESENCES);
validateRoles(ROLES);
validateTiles(TILES);

export const PREFIXES = ['!', '?'];
export const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN?.trim();
export const OWNER_ID = process.env.OWNER_ID?.trim();

export { CHANNELS, COMMANDS, MAPS, PRESENCES, ROLES, TILES };
