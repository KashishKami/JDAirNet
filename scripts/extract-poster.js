const ffmpeg = require('ffmpeg-static');
const { execSync } = require('child_process');
const path = require('path');

const videoPath = path.resolve(__dirname, '../public/Hero.mp4');
const posterPath = path.resolve(__dirname, '../public/hero-poster.jpg');

console.log('Extracting frame from:', videoPath);
execSync(`"${ffmpeg}" -i "${videoPath}" -ss 00:00:02 -frames:v 1 "${posterPath}" -y`, { stdio: 'inherit' });
console.log('Successfully saved to:', posterPath);
