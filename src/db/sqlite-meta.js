import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

const dbFile = path.join(process.cwd(), 'data', 'botdata.sqlite');

export async function openDB() {
    return open({
        filename: dbFile,
        driver: sqlite3.Database
    });
}

// Create meta table if it doesn't exist
export async function initMetaTable() {
    const db = await openDB();
    await db.exec(`
        CREATE TABLE IF NOT EXISTS bot_meta (
            key TEXT PRIMARY KEY,
            value TEXT
        )
    `);
}

export async function getLastSync(key = 'last_members_sync') {
    const db = await openDB();
    const row = await db.get('SELECT value FROM bot_meta WHERE key = ?', key);
    if (!row) return null;
    return new Date(row.value);
}

export async function updateLastSync(key = 'last_members_sync') {
    const db = await openDB();
    const now = new Date().toISOString();
    await db.run(
        `INSERT INTO bot_meta (key, value) VALUES (?, ?)
         ON CONFLICT(key) DO UPDATE SET value = ?`,
        key, now, now
    );
}

export async function shouldSyncDB(key = 'last_members_sync') {
    const lastSync = await getLastSync(key);
    if (!lastSync) return true; // never synced
    const diff = new Date() - lastSync;
    return diff > 24 * 60 * 60 * 1000; // more than 24h?
}
