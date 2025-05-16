const fs = require('fs');
const path = require('path');

function getFormattedDate() {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');

    const year = now.getFullYear();
    const month = pad(now.getMonth() + 1);
    const day = pad(now.getDate());
    const hours = pad(now.getHours());
    const minutes = pad(now.getMinutes());
    const seconds = pad(now.getSeconds());

    return {
        date: `${year}-${month}-${day}`,
        timestamp: `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    };
}

function logCommand(commandName, userTag) {
    const { date, timestamp } = getFormattedDate();
    const logFileName = `command-log-${date}.txt`;
    const logFilePath = path.join(__dirname, '../data/', logFileName);

    const logLine = `[${timestamp}] ${userTag} used command: ${commandName}\n`;

    fs.appendFile(logFilePath, logLine, (err) => {
        if (err) {
            console.error('❌ Failed to write to command log:', err);
        }
    });
}

module.exports = logCommand;
