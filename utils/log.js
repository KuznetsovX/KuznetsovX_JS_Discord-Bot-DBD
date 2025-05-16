const formatTimestamp = () => {
    const now = new Date();
    const date = now.toLocaleDateString('en-CA');
    const time = now.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
    return `${date} ${time}`;
};

const log = {
    info: (msg) => {
        console.log(`[INFO] ${formatTimestamp()} — ${msg}`);
    },
    warn: (msg) => {
        console.warn(`[WARN] ${formatTimestamp()} — ${msg}`);
    },
    error: (msg, err = null) => {
        console.error(`[ERROR] ${formatTimestamp()} — ${msg}`);
        if (err) console.error(err);
    },
    action: (label, msg) => {
        console.log(`[${label.toUpperCase()}] ${formatTimestamp()} — ${msg}`);
    }
};

module.exports = log;
