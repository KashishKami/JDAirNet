/**
 * optimize-404-1.js
 * Optimizes public/404_1.mp4 -> 404_1.mp4 (re-encoded) + 404_1.webm (VP9) + 404_1-poster.jpg
 */

const ffmpeg = require('ffmpeg-static')
const { execSync } = require('child_process')
const path = require('path')
const fs = require('fs')

const pub = path.resolve(__dirname, '../public')

function run(cmd) {
  console.log('\n▶', cmd)
  execSync(cmd, { stdio: 'inherit' })
}

function sizeMB(file) {
  try {
    return (fs.statSync(file).size / 1024 / 1024).toFixed(2) + ' MB'
  } catch {
    return 'not found'
  }
}

const vIn = path.join(pub, '404_1.mp4')
const vTempMp4 = path.join(pub, '404_1_opt.mp4')
const vWebm = path.join(pub, '404_1.webm')
const vPoster = path.join(pub, '404_1-poster.jpg')

console.log('\n════ 404_1 VIDEO OPTIMIZATION ════')
console.log('Input:', vIn, '—', sizeMB(vIn))

// Re-encode MP4 at 720p, CRF 30 (H.264), no audio or compressed audio
run(`"${ffmpeg}" -i "${vIn}" -vf "scale=-2:720" -c:v libx264 -crf 30 -preset slow -an -movflags +faststart -y "${vTempMp4}"`)

// WebM VP9 at 720p, CRF 35, deadline good, cpu-used 4, no audio
run(`"${ffmpeg}" -i "${vIn}" -vf "scale=-2:720" -c:v libvpx-vp9 -crf 35 -b:v 0 -deadline good -cpu-used 4 -an -y "${vWebm}"`)

// Extract poster frame at 1s
run(`"${ffmpeg}" -i "${vIn}" -ss 00:00:01 -frames:v 1 -update 1 -y "${vPoster}"`)

// Overwrite original 404_1.mp4 with optimized version
fs.renameSync(vTempMp4, vIn)

console.log('\n✅ 404_1 optimization complete:')
console.log('404_1.mp4:       ', sizeMB(vIn))
console.log('404_1.webm:      ', sizeMB(vWebm))
console.log('404_1-poster.jpg:', sizeMB(vPoster))
