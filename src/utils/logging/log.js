// Function to format the current timestamp as 'YYYY-MM-DD HH:MM:SS'
const formatTimestamp = () => {
    const now = new Date();
    const date = now.toLocaleDateString('en-CA'); // YYYY-MM-DD
    const time = now.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
    return `${date} ${time}`;
};

// ANSI color codes
const colors = {
    reset: "\x1b[0m",
    blue: "\x1b[34m",
    yellow: "\x1b[33m",
    red: "\x1b[31m",
    magenta: "\x1b[35m",
    gray: "\x1b[90m",
};

// Centralized log utility
const log = {
    _log: (level, label, msg, err = null) => {
        let color, icon;
        switch (level.toLowerCase()) {
            case 'action':
                color = colors.magenta; icon = '⚡'; break;
            case 'info':
                color = colors.blue; icon = '❕'; break;
            case 'warn':
                color = colors.yellow; icon = '🚧'; break;
            case 'error':
                color = colors.red; icon = '🛑'; break;
            default:
                color = colors.reset; icon = '🔹';
        }

        const header = `${color}[${icon} ${label.toUpperCase()}]${colors.reset}`;
        const timestamp = `${colors.gray}${formatTimestamp()}${colors.reset}`;
        const message = `${header} ${timestamp} — ${msg}`;

        switch (level.toLowerCase()) {
            case 'action': console.log(message); break;
            case 'info': console.log(message); break;
            case 'warn': console.warn(message); break;
            case 'error': console.error(message); if (err) console.error(err); break;
            default: console.log(message);
        }
    },

    action: (label, msg) => log._log('action', label, msg),
    info: (label, msg) => log._log('info', label, msg),
    warn: (label, msg) => log._log('warn', label, msg),
    error: (label, msg, err) => log._log('error', label, msg, err),
};

export default log;
