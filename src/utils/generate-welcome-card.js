import { createCanvas, loadImage } from 'canvas';
import { AttachmentBuilder } from 'discord.js';
import path from 'path';
import { fileURLToPath } from 'url';

// __dirname replacement for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function generateWelcomeCard(member) {
    const width = 800;
    const height = 300;

    // Create a blank canvas and get context
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Draw background image
    const bgPath = path.join(__dirname, '../assets/dbd-exe_bg.png');
    const background = await loadImage(bgPath);
    ctx.drawImage(background, 0, 0, width, height);

    // Load and draw user's avatar as a circle
    const avatarURL = member.user.displayAvatarURL({ extension: 'png', size: 128 });
    const avatar = await loadImage(avatarURL);

    const avatarSize = 128;
    const avatarX = 50;
    const avatarY = height / 2 - avatarSize / 2;

    ctx.save();
    ctx.beginPath();
    ctx.arc(
        avatarX + avatarSize / 2,
        avatarY + avatarSize / 2,
        avatarSize / 2,
        0,
        Math.PI * 2
    );
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatar, avatarX, avatarY, avatarSize, avatarSize);
    ctx.restore();

    // Background box behind text for contrast
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(190, height / 2 - 25, 580, 50);

    // Draw welcome message with shadow
    ctx.font = 'bold 30px Sans-serif';

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillText(`Welcome, ${member.displayName}`, 202, height / 2 + 12);

    // Foreground text
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`Welcome, ${member.displayName}`, 200, height / 2 + 10);

    // Return image as a Discord attachment
    const buffer = canvas.toBuffer('image/png');
    return new AttachmentBuilder(buffer, { name: 'welcome.png' });
};
