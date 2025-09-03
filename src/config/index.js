import dotenv from 'dotenv';
dotenv.config();

import CHANNELS from './channels.js';
import COMMANDS from './commands.js';
import ROLES from './roles.js';
import TILES from './tiles.js';

import validateCommands from '../utils/validators/commands-validator.js';
import validateChannels from '../utils/validators/channels-validator.js';
import validateRoles from '../utils/validators/roles-validator.js';

validateCommands(COMMANDS);
validateChannels(CHANNELS);
validateRoles(ROLES);

export const PREFIXES = ['!', '?'];
export const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN?.trim();
export const OWNER_ID = process.env.OWNER_ID?.trim();

export { CHANNELS, COMMANDS, ROLES, TILES };
