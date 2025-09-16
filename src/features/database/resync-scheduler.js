import { shouldBackup, runBackup, syncMembersToDB, getLastSyncMs, updateLastSync } from '../../db/index.js';
import log from '../../utils/logging/log.js';

export async function scheduleNextResync(guild) {
    try {
        const now = Date.now();
        const lastSync = await getLastSyncMs(); // Returns timestamp
        const interval = 24 * 60 * 60 * 1000; // 24h
        const timeSinceLastSync = now - lastSync;
        const timeLeft = interval - timeSinceLastSync;

        if (timeSinceLastSync >= interval) {
            await runResync(guild);
            // Schedule next sync 24h later
            setTimeout(() => scheduleNextResync(guild), interval);
        } else {
            log.info('RESYNC SCHEDULER', `⏳ Scheduling next DB sync in ${Math.ceil(timeLeft / 1000 / 60)} minutes.`);
            setTimeout(async () => {
                await runResync(guild);
                setTimeout(() => scheduleNextResync(guild), interval);
            }, timeLeft);
        }
    } catch (err) {
        log.error('RESYNC SCHEDULER', '❌ Failed to schedule next resync', err);
    }
}

async function runResync(guild) {
    try {
        log.info('RESYNC', '⏳ Running DB sync...');
        await syncMembersToDB(guild);

        if (await shouldBackup()) {
            await runBackup();
            log.action('RESYNC', '💾 Database backup created (24h interval check).');
        }

        await updateLastSync();
        log.action('RESYNC', '✅ Members synced to DB.');
    } catch (err) {
        log.error('RESYNC', '❌ Resync failed', err);
    }
}
