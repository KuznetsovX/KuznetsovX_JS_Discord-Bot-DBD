import { Meta } from '../connection/index.js';

/**
 * Get last sync time
 * @param {string} key
 * @returns {Promise<Date|null>}
 */
export async function getLastSync(key = 'last_members_sync') {
    const row = await Meta.findByPk(key);
    return row ? new Date(row.value) : null;
}

/**
 * Update last sync time
 * @param {string} key
 */
export async function updateLastSync(key = 'last_members_sync') {
    const now = new Date().toISOString();
    await Meta.upsert({ key, value: now });
}

/**
 * Should we sync the DB? (if last sync > 24h)
 * @param {string} key
 */
export async function shouldSyncDB(key = 'last_members_sync') {
    const lastSync = await getLastSync(key);
    if (!lastSync) return true;
    return (new Date() - lastSync) > 24 * 60 * 60 * 1000;
}
