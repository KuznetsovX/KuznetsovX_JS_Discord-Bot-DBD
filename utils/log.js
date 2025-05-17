// Function to format the current timestamp as a string in the 'YYYY-MM-DD HH:MM:SS' format
const formatTimestamp = () => {
    const now = new Date();
    const date = now.toLocaleDateString('en-CA');
    const time = now.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
    return `${date} ${time}`;  // Returning the formatted timestamp
};

// Log utility with different log levels: info, warn, error, and action
const log = {
    // Logs an informational message
    info: (msg) => {
        console.log(`[INFO] ${formatTimestamp()} — ${msg}`);
    },
    // Logs a warning message
    warn: (msg) => {
        console.warn(`[WARN] ${formatTimestamp()} — ${msg}`);
    },
    // Logs an error message, with an optional error object
    error: (msg, err = null) => {
        console.error(`[ERROR] ${formatTimestamp()} — ${msg}`);
        if (err) console.error(err);  // Log the error stack if provided
    },
    // Logs an action with a custom label
    action: (label, msg) => {
        console.log(`[${label.toUpperCase()}] ${formatTimestamp()} — ${msg}`);
    }
};

module.exports = log;
