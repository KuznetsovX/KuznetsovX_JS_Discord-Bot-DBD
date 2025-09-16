import { shouldBackup, runBackup, syncMembersToDB, shouldSyncDB, updateLastSync } from '../../db/index.js';
import log from '../../utils/logging/log.js';

export function startHourlyResync(guild) {
    setInterval(async () => {
        try {
            log.info('HOURLY RESYNC', '⏳ Running hourly DB sync check...');
            if (await shouldSyncDB()) {
                await syncMembersToDB(guild);
                if (await shouldBackup()) {
                    await runBackup();
                    log.action('HOURLY RESYNC', '💾 Database backup created (24h interval check).');
                }
                await updateLastSync();
                log.action('HOURLY RESYNC', '✅ Members synced to DB (hourly check).');
            } else {
                log.info('HOURLY RESYNC', '⏩ DB sync skipped (less than 24h since last sync).');
            }
        } catch (err) {
            log.error('HOURLY RESYNC', '❌ Hourly resync failed', err);
        }
    }, 1000 * 60 * 60); // every 1 hour

    log.info('HOURLY RESYNC', '🔄 Hourly resync scheduling initialized.');
}
