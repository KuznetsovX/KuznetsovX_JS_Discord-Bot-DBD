const userCooldowns = new Map();
const DEFAULT_COOLDOWN = 3000;

export function checkCooldown(userId, commandName) {
    const key = `${commandName}-${userId}`;
    const lastUsed = userCooldowns.get(key);
    if (lastUsed && (Date.now() - lastUsed) < DEFAULT_COOLDOWN) {
        return true;
    }
    userCooldowns.set(key, Date.now());
    setTimeout(() => userCooldowns.delete(key), DEFAULT_COOLDOWN);
    return false;
}
