export const commandLocks = new Map();

/**
 * Check if a command is locked.
 * @param {string} key
 * @returns {boolean}
 */
export function isLocked(key) {
    return commandLocks.get(key) === true;
}

/**
 * Acquire a lock for a command.
 * @param {string} key
 */
export function acquireLock(key) {
    commandLocks.set(key, true);
}

/**
 * Release a lock for a command.
 * @param {string} key
 */
export function releaseLock(key) {
    commandLocks.delete(key);
}
