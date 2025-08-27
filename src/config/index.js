import dotenv from 'dotenv';
dotenv.config();

import CHANNELS from './channels.js';
import COMMANDS from './commands.js';
import ROLES from './roles.js';

export const PREFIXES = ['!', '?'];
export const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN?.trim();
export const OWNER_ID = process.env.OWNER_ID?.trim();

export { CHANNELS, COMMANDS, ROLES };
