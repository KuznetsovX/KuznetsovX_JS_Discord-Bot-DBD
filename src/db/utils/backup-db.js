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

    // Run pg_dump (plain SQL)
    const pgDumpPath = 'D:\\PostgreSQL\\bin\\pg_dump.exe'; // adjust path if necessary
    const command = `set PGPASSWORD=${DB_PASSWORD}&& "${pgDumpPath}" -U ${DB_USER} -h ${DB_HOST} -p ${DB_PORT} -d ${DB_NAME} -F p -f "${backupFile}"`;

    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                log.error('BACKUP DB', '❌ Backup failed:', error.message);
                return reject(error);
            }
            if (stderr) log.error('BACKUP DB', 'stderr:', stderr);

            log.action('BACKUP DB', `✅ Backup successful, new file created: ${backupFile}`);
            updateLastSync('last_db_backup'); // mark backup done
            resolve(backupFile);
        });
    });
}
