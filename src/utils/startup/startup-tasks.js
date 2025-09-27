import { scheduleNextResync } from '../../database/scheduler/resync.js';
import log from '../logging/log.js';
import { assignDefaultRole, manageTierRoles, restoreRoles } from '../roles/role-manager.js';
import { initReadme } from '../roles/reaction-roles/index.js';

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
            await task.action();
            log.info('READY', `✅ Completed: ${task.name}`);

            if (progressMessage) {
                const progressBar = '🟩'.repeat(i + 1) + '⬜'.repeat(tasks.length - i - 1);
                await progressMessage.edit(`Progress: [${progressBar}] ${task.name}`);
            }
        } catch (err) {
            log.error('READY', `❌ Task failed: ${task.name}`, err);
            if (progressMessage) await progressMessage.edit(`⚠️ Startup failed at task: \`${task.name}\``);
            throw err; // stop startup on first failure
        }
    }

    if (progressMessage) {
        await progressMessage.edit(`✅ Startup complete! ${client.user.tag} is ready to use.`);
    }
}
