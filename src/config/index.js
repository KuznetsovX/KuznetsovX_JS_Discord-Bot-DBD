import dotenv from 'dotenv';
dotenv.config();

import { CHANNELS } from './channels.js';
import COMMANDS from './commands.js';
import { ROLES, ROLE_TIERS } from './roles.js';

export const PREFIXES = ['!', '?'];

export default {
    CHANNELS,
    COMMANDS,
    ROLES,
    ROLE_TIERS,
    PREFIXES,
    DISCORD_BOT_TOKEN: process.env.DISCORD_BOT_TOKEN?.trim(),
    OWNER_ID: process.env.OWNER_ID?.trim(),
};
