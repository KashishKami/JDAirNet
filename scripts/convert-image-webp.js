const ffmpeg = require('ffmpeg-static')
const { execSync } = require('child_process')
const path = require('path')
const fs = require('fs')

const input = path.join(__dirname, '..', 'public', 'Why_choose_us-removebg-preview.png')
const output = path.join(__dirname, '..', 'public', 'Why_choose_us-removebg-preview.webp')

if (fs.existsSync(input)) {
  console.log('Converting', input, 'to WebP...')
  execSync(`"${ffmpeg}" -i "${input}" -c:v libwebp -quality 85 "${output}" -y`, { stdio: 'inherit' })
  const inSize = (fs.statSync(input).size / 1024).toFixed(1)
  const outSize = (fs.statSync(output).size / 1024).toFixed(1)
  console.log(`✅ Conversion complete: ${inSize} KB → ${outSize} KB (${Math.round((1 - outSize/inSize)*100)}% reduction)`)
} else {
  console.error('Input file not found:', input)
}
