import { scheduleNextResync } from '../../database/scheduler/resync.js';
import log from '../logging/log.js';
import { assignDefaultRole, manageTierRoles, restoreRoles } from '../roles/role-manager.js';
import { initReadme } from '../roles/reaction-roles/index.js';

function withTimeout(promise, ms, taskName) {
    return Promise.race([
        promise,
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error(`Timeout: ${taskName} took longer than ${ms / 1000}s`)), ms)
        ),
    ]);
}

export async function runStartupTasks(client, guild, channel) {
    const tasks = [
        { name: 'Fetching members', action: async () => guild.members.fetch() },
        { name: 'Restoring roles', action: async () => restoreRoles(guild) },
        { name: 'Assigning default role', action: async () => assignDefaultRole(guild) },
        { name: 'Managing tier roles', action: async () => manageTierRoles(guild) },
        { name: 'Scheduling next resync', action: async () => scheduleNextResync(guild) },
        { name: 'Initializing readme', action: async () => initReadme(client, guild) },
    ];

    let progressMessage = null;
    if (channel) {
        progressMessage = await channel.send('Starting up...');
    }

    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        try {
            await withTimeout(task.action(), 10000, task.name);
            log.info('READY', `✅ Completed: ${task.name}`);

            if (progressMessage) {
                const progressBar = '🟩'.repeat(i + 1) + '⬜'.repeat(tasks.length - i - 1);
                await progressMessage.edit(`Progress: [${progressBar}] ${task.name}`);
            }
        } catch (err) {
            log.warn('READY', `⚠️ Skipped or timed out: ${task.name}`, err);
            if (progressMessage) {
                await progressMessage.edit(`⚠️ Skipped: \`${task.name}\` (reason: ${err.message})`);
            }
            // continue to next task instead of throwing
        }
    }

    if (progressMessage) {
        log.action('READY', `✅ Completed all startup tasks (with time limits).`);
        await progressMessage.edit(`✅ Startup complete! ${client.user.tag} is ready to use.`);
    }
}
