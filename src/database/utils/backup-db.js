import dotenv from 'dotenv';
dotenv.config();

import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { getLastSync, updateLastSync } from './sync-metadata.js';
import log from '../../utils/logging/log.js';

const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const pgDumpPath = process.env.PG_DUMP_PATH;
const pgDumpPathAlt = process.env.PG_DUMP_PATH_ALT;

// Backup folder
const backupFolder = path.resolve('./data/.db-backup');
if (!fs.existsSync(backupFolder)) fs.mkdirSync(backupFolder, { recursive: true });

// Amount of backups to keep
const keepBackups = 14;

/**
 * Check if backup is needed (24h interval)
 * @param {string} key
 * @returns {Promise<boolean>}
 */
export async function shouldBackup(key = 'last_db_backup') {
    const lastBackup = await getLastSync(key);
    if (!lastBackup) return true;
    return (new Date() - lastBackup) > 24 * 60 * 60 * 1000; // 24h
}

/**
 * Run pg_dump command with given path
 * @param {string} dumpPath
 * @param {string} backupFile
 * @returns {Promise<void>}
 */
function execDump(dumpPath, backupFile) {
    const command = `set PGPASSWORD=${DB_PASSWORD}&& "${dumpPath}" -U ${DB_USER} -h ${DB_HOST} -p ${DB_PORT} -d ${DB_NAME} -F p -f "${backupFile}"`;

    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                return reject(new Error(error.message));
            }
            if (stderr) {
                log.warn('BACKUP DB', `stderr from ${dumpPath}:`, stderr);
            }
            resolve();
        });
    });
}

/**
 * Run database backup
 * @returns {Promise<string>} path to backup file
 */
export async function runBackup() {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB').replace(/\//g, '-') +
        '_' + now.toTimeString().slice(0, 8).replace(/:/g, '-');
    const backupFile = path.join(backupFolder, `backup-${dateStr}.sql`);

    log.info('BACKUP DB', `💾 Starting backup: ${backupFile}`);

    // Remove oldest backups if we exceed limit
    const files = fs.readdirSync(backupFolder)
        .filter(f => f.endsWith('.sql'))
        .sort((a, b) => fs.statSync(path.join(backupFolder, a)).mtime - fs.statSync(path.join(backupFolder, b)).mtime);

    while (files.length >= keepBackups) {
        const fileToDelete = path.join(backupFolder, files.shift());
        fs.unlinkSync(fileToDelete);
        log.action('BACKUP DB', `🗑️ Deleted old backup file: ${fileToDelete}`);
    }

    // Try main path, fall back to alt
    let usedPath = null;

    if (pgDumpPath && fs.existsSync(pgDumpPath)) {
        usedPath = pgDumpPath;
    } else if (pgDumpPathAlt && fs.existsSync(pgDumpPathAlt)) {
        log.warn('BACKUP DB', `Main pg_dump not found at ${pgDumpPath}, using alt path.`);
        usedPath = pgDumpPathAlt;
    } else {
        throw new Error('No valid pg_dump path found (main or alt).');
    }

    try {
        await execDump(usedPath, backupFile);
        log.action('BACKUP DB', `✅ Backup successful with path: ${usedPath}`);
    } catch (err) {
        log.error('BACKUP DB', `❌ pg_dump failed at ${usedPath}: ${err.message}`);
        throw err;
    }

    await updateLastSync('last_db_backup');
    return backupFile;
}
