/**
 * optimize-videos.js
 *
 * Uses ffmpeg-static (already installed) to:
 * 1. Optimize Hero.mp4   → Hero.mp4 (re-encoded, smaller) + Hero.webm (VP9, smallest)
 * 2. Optimize 404.mp4    → 404.mp4 (re-encoded, smaller) + 404.webm (VP9, smallest)
 * 3. Extract poster frames: hero-poster.jpg (@ 2s) + 404-poster.jpg (@ 1s)
 *
 * Output files land in /public. Originals are overwritten in-place for MP4
 * (backup manually if needed before running).
 *
 * Run: node scripts/optimize-videos.js
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

// ─── 1. HERO VIDEO ─────────────────────────────────────────────────────────
const heroIn   = path.join(pub, 'Hero.mp4')
const heroMp4  = path.join(pub, 'Hero_opt.mp4')   // write to temp, then swap
const heroWebm = path.join(pub, 'Hero.webm')
const heroPoster = path.join(pub, 'hero-poster.jpg')

console.log('\n════ HERO VIDEO ════')
console.log('Input:', heroIn, '—', sizeMB(heroIn))

// Re-encode MP4 at 720p, CRF 28 (H.264) — good quality, ~50-60% smaller
run(`"${ffmpeg}" -i "${heroIn}" -vf "scale=-2:720" -c:v libx264 -crf 28 -preset slow -c:a aac -b:a 128k -movflags +faststart -y "${heroMp4}"`)

// WebM VP9 at 720p, CRF 33 — best compression for Chrome/Firefox/Edge
run(`"${ffmpeg}" -i "${heroIn}" -vf "scale=-2:720" -c:v libvpx-vp9 -crf 33 -b:v 0 -deadline good -cpu-used 4 -c:a libopus -b:a 96k -y "${heroWebm}"`)

// Extract poster at 2s (same as original script)
run(`"${ffmpeg}" -i "${heroIn}" -ss 00:00:02 -frames:v 1 -update 1 -y "${heroPoster}"`)

// Swap optimised MP4 over the original
fs.renameSync(heroMp4, heroIn)
console.log('Hero.mp4 optimised:', sizeMB(heroIn))
console.log('Hero.webm created: ', sizeMB(heroWebm))

// ─── 2. 404 VIDEO ──────────────────────────────────────────────────────────
const v404In   = path.join(pub, '404.mp4')
const v404Mp4  = path.join(pub, '404_opt.mp4')
const v404Webm = path.join(pub, '404.webm')
const v404Poster = path.join(pub, '404-poster.jpg')

console.log('\n════ 404 VIDEO ════')
console.log('Input:', v404In, '—', sizeMB(v404In))

// Re-encode 404.mp4 at 720p, CRF 30 — slightly more compression (bg video)
run(`"${ffmpeg}" -i "${v404In}" -vf "scale=-2:720" -c:v libx264 -crf 30 -preset slow -c:a aac -b:a 96k -movflags +faststart -y "${v404Mp4}"`)

// WebM VP9 at 720p, CRF 35
run(`"${ffmpeg}" -i "${v404In}" -vf "scale=-2:720" -c:v libvpx-vp9 -crf 35 -b:v 0 -deadline good -cpu-used 4 -an -y "${v404Webm}"`)

// Extract poster at 1s
run(`"${ffmpeg}" -i "${v404In}" -ss 00:00:01 -frames:v 1 -update 1 -y "${v404Poster}"`)

fs.renameSync(v404Mp4, v404In)
console.log('404.mp4 optimised: ', sizeMB(v404In))
console.log('404.webm created:  ', sizeMB(v404Webm))

// ─── 3. 404_1 VIDEO ────────────────────────────────────────────────────────
const v404_1In   = path.join(pub, '404_1.mp4')
const v404_1Mp4  = path.join(pub, '404_1_opt.mp4')
const v404_1Webm = path.join(pub, '404_1.webm')
const v404_1Poster = path.join(pub, '404_1-poster.jpg')

if (fs.existsSync(v404_1In)) {
  console.log('\n════ 404_1 VIDEO ════')
  console.log('Input:', v404_1In, '—', sizeMB(v404_1In))

  run(`"${ffmpeg}" -i "${v404_1In}" -vf "scale=-2:720" -c:v libx264 -crf 30 -preset slow -an -movflags +faststart -y "${v404_1Mp4}"`)
  run(`"${ffmpeg}" -i "${v404_1In}" -vf "scale=-2:720" -c:v libvpx-vp9 -crf 35 -b:v 0 -deadline good -cpu-used 4 -an -y "${v404_1Webm}"`)
  run(`"${ffmpeg}" -i "${v404_1In}" -ss 00:00:01 -frames:v 1 -update 1 -y "${v404_1Poster}"`)

  fs.renameSync(v404_1Mp4, v404_1In)
  console.log('404_1.mp4 optimised: ', sizeMB(v404_1In))
  console.log('404_1.webm created:  ', sizeMB(v404_1Webm))
}

console.log('\n✅  All done. Files in /public:')
;['Hero.mp4', 'Hero.webm', 'hero-poster.jpg', '404.mp4', '404.webm', '404-poster.jpg', '404_1.mp4', '404_1.webm', '404_1-poster.jpg']
  .forEach(f => console.log(' ', f.padEnd(20), sizeMB(path.join(pub, f))))
