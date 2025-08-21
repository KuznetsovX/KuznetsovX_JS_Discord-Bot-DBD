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

// Centralized log utility
const log = {
    // Generic logger used internally
    _log: (level, label, msg, err = null) => {
        const header = `[${level.toUpperCase()} - ${label.toUpperCase()}]`;
        const message = `${header} ${formatTimestamp()} — ${msg}`;
        switch (level.toLowerCase()) {
            case 'info':
                console.log(message);
                break;
            case 'warn':
                console.warn(message);
                break;
            case 'error':
                console.error(message);
                if (err) console.error(err); // Log error stack if provided
                break;
            case 'action':
                console.log(message);
                break;
            default:
                console.log(message);
        }
    },

    // Convenience methods
    info: (label, msg) => log._log('info', label, msg),
    warn: (label, msg) => log._log('warn', label, msg),
    error: (label, msg, err) => log._log('error', label, msg, err),
    action: (label, msg) => log._log('action', label, msg),
};

export default log;
