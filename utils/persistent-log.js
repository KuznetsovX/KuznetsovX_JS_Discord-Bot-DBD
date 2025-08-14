import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// __dirname replacement for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to get the current date and formatted timestamp
function getFormattedDate() {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');  // Helper to pad numbers with leading zero

    // Get individual components of the date and time
    const year = now.getFullYear();
    const month = pad(now.getMonth() + 1);
    const day = pad(now.getDate());
    const hours = pad(now.getHours());
    const minutes = pad(now.getMinutes());
    const seconds = pad(now.getSeconds());

    return {
        date: `${year}-${month}-${day}`,  // Format date as 'YYYY-MM-DD'
        timestamp: `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`  // Full timestamp
    };
}

// Function to log commands to a text file
export function logCommand(commandName, userTag) {
    const { date, timestamp } = getFormattedDate();  // Get the formatted date and timestamp
    const logFileName = `command-log-${date}.log`;  // Create a log file name based on the date
    const logFilePath = path.join(__dirname, '../data/', logFileName);  // Set the log file path

    const logLine = `[${timestamp}] ${userTag} used command: ${commandName}\n`;  // Format the log entry

    // Append the log entry to the file
    fs.appendFile(logFilePath, logLine, (err) => {
        if (err) {
            console.error('❌ Failed to write to command log:', err);
        }
    });
}
