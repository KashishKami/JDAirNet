const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const outDir = path.join(__dirname, '..', 'out')
const zipPath = path.join(outDir, 'website.zip')

if (!fs.existsSync(outDir)) {
  console.error('Error: "out" directory does not exist. Run "npm run build" first.')
  process.exit(1)
}

// Ensure .htaccess is present in out/
const sourceHtaccess = path.join(__dirname, '..', 'public', '.htaccess')
const targetHtaccess = path.join(outDir, '.htaccess')

if (fs.existsSync(sourceHtaccess)) {
  fs.copyFileSync(sourceHtaccess, targetHtaccess)
  console.log('✅ Copied public/.htaccess to out/.htaccess')
}

// Remove old zip if exists
if (fs.existsSync(zipPath)) {
  fs.unlinkSync(zipPath)
}

console.log('📦 Creating deployment package: out/website.zip...')

try {
  if (process.platform === 'win32') {
    // Windows PowerShell Compress-Archive
    execSync(
      `powershell -Command "Get-ChildItem -Path '${outDir}\\*' -Force | Where-Object { $_.Name -ne 'website.zip' } | Compress-Archive -DestinationPath '${zipPath}' -Force"`,
      { stdio: 'inherit' }
    )
  } else {
    // Unix zip
    execSync(
      `cd "${outDir}" && zip -r website.zip . -x website.zip`,
      { stdio: 'inherit' }
    )
  }
  const stats = fs.statSync(zipPath)
  console.log(`🎉 website.zip created successfully! (${(stats.size / (1024 * 1024)).toFixed(2)} MB)`)
  console.log('👉 Upload this single website.zip to Hostinger / GoDaddy public_html/ and extract it.')
} catch (err) {
  console.error('Failed to create website.zip:', err)
  process.exit(1)
}
