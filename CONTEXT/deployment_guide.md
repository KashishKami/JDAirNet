# Production Deployment Guide: JDAirNet → Hostinger Shared Hosting

This document provides exact step-by-step instructions for building the Next.js static export and deploying to Hostinger shared hosting, including PHP mailer setup for the contact form.

---

## Overview: Deployment Architecture

```
Local Machine                    Hostinger public_html/
──────────────────               ──────────────────────────────
Next.js project                  index.html
  npm run build                  plans/index.html
      ↓                          lease-lines/index.html
  out/ folder           →  FTP   coverage/index.html
      ↓                          about/index.html
  contact.php (separate)  →  FTP  contact/index.html
                                  contact.php          ← PHP mailer
                                  sitemap.xml
                                  robots.txt
                                  _next/ (assets)
                                  hero.mp4
                                  .htaccess            ← HTTPS redirect
```

---

## Step 1: Update Production Environment Variables

Before building, ensure these values are correct for production:

```env
# .env.production (create this file locally, do NOT commit)
NEXT_PUBLIC_SITE_URL=https://jdairnet.com          # Real domain
NEXT_PUBLIC_CONTACT_ENDPOINT=/contact.php
NEXT_PUBLIC_BLOG_ENABLED=false                      # false until blog is ready
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX                      # Google Analytics ID (when ready)
```

> ⚠️ Never commit `.env.production` to Git — it may contain API keys in future.

---

## Step 2: Build the Static Export

```bash
# On your local machine, inside the project root:
npm run build
```

This runs `next build` with `output: 'export'` active in production mode.

**Output:** An `out/` folder is created at the project root containing all static files.

**Verify the build:**
```bash
npm run serve
# Opens http://127.0.0.1:3000 (npx serve default)
# Navigate through all pages and verify everything works
```

---

## Step 3: Prepare `contact.php` for Deployment

The `contact.php` file is NOT part of the `out/` folder. It is maintained separately and deployed to `public_html/` alongside the static files.

### Full `contact.php` Template

```php
<?php
// contact.php — JDAirNet Contact Form Handler
// Deploy to: Hostinger public_html/contact.php

header('Access-Control-Allow-Origin: https://jdairnet.com');
header('Access-Control-Allow-Methods: POST');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Collect and sanitize inputs
$name    = htmlspecialchars(trim($_POST['name'] ?? ''));
$email   = filter_var(trim($_POST['email'] ?? ''), FILTER_SANITIZE_EMAIL);
$phone   = htmlspecialchars(trim($_POST['phone'] ?? ''));
$message = htmlspecialchars(trim($_POST['message'] ?? ''));

// Validation
if (empty($name) || empty($email) || empty($message)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Name, email, and message are required.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid email address.']);
    exit;
}

// ── Email Configuration ───────────────────────────────────────────
// UPDATE THESE VALUES with real Hostinger email credentials:
$to      = 'info@jdairnet.com';           // WHERE the email goes (company inbox)
$from    = 'noreply@jdairnet.com';        // Hostinger email account (must exist in hPanel)
$subject = 'New Contact Form Submission — JDAirNet';

$body = "New contact form submission from the JDAirNet website.\n\n";
$body .= "Name:    $name\n";
$body .= "Email:   $email\n";
$body .= "Phone:   $phone\n";
$body .= "Message:\n$message\n";

$headers  = "From: JDAirNet Website <$from>\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// Send email using PHP's built-in mail() function
// Hostinger's shared hosting configures sendmail automatically
if (mail($to, $subject, $body, $headers)) {
    echo json_encode(['success' => true, 'message' => 'Message sent successfully.']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to send. Please call us directly.']);
}
?>
```

> **If `mail()` doesn't work on Hostinger:** Use PHPMailer with SMTP. Install PHPMailer via Composer or include it manually, then configure with Hostinger SMTP settings:
> - SMTP Host: `smtp.hostinger.com`
> - Port: 465 (SSL) or 587 (TLS)
> - Username: Your Hostinger email address (e.g., `noreply@jdairnet.com`)
> - Password: The email account password set in Hostinger hPanel

---

## Step 4: Create `.htaccess` File

Create a `.htaccess` file and place it in `public_html/` alongside the exported files:

```apache
# .htaccess - JDAirNet Hostinger Deployment

# Force HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Remove www to non-www (optional, uncomment to activate)
# RewriteCond %{HTTP_HOST} ^www\.(.+)$ [NC]
# RewriteRule ^ https://%1%{REQUEST_URI} [R=301,L]

# Custom 404 Page
# Next.js exports not-found.tsx as /404/index.html with trailingSlash:true
# Apache must be told to serve it for any missing URL
ErrorDocument 404 /404/index.html

# Enforce Trailing Slash (belt-and-suspenders for trailingSlash: true)
# Ensures /plans redirects to /plans/ so Apache finds plans/index.html
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_URI} !/$
RewriteCond %{REQUEST_URI} !\.[a-zA-Z0-9]+$
RewriteRule ^(.*)$ /$1/ [R=301,L]
```
---

## Step 5: Deploy to Hostinger via File Manager

### Option A: Hostinger File Manager (Recommended for first deploy)

1. Log in to [hPanel](https://hpanel.hostinger.com)
2. Go to **Hosting** → Your hosting plan → **File Manager**
3. Navigate to `public_html/`
4. **Delete any existing `index.html`** that Hostinger put there by default
5. Click **Upload** → Select all files INSIDE the `out/` folder (not the `out/` folder itself)
6. Upload `contact.php` separately (drag it into `public_html/` root)
7. Upload `.htaccess` to `public_html/` root

### Option B: FTP Client (FileZilla — for subsequent deploys)

**FTP Credentials** (get from Hostinger hPanel → FTP Accounts):
- Host: `ftp.jdairnet.com` (or your domain / Hostinger FTP host)
- Port: `21`
- Username: Your FTP username
- Password: Your FTP password

1. Connect FileZilla to Hostinger
2. Navigate to `public_html/` on the remote side
3. Drag ALL contents of local `out/` folder into `public_html/`
4. Upload `contact.php` separately to `public_html/`
5. Upload `.htaccess` to `public_html/`

---

## Step 6: Set Up Hostinger Email for PHP Mailer

1. In hPanel → **Emails** → **Email Accounts**
2. Create email: `noreply@jdairnet.com` (or your domain)
3. Set a strong password
4. Update `contact.php` with these credentials if using PHPMailer+SMTP
5. Also create: `info@jdairnet.com` — this is WHERE form submissions land

---

## Step 7: Configure SSL Certificate

1. In hPanel → **SSL** → **SSL/TLS Status**
2. If Let's Encrypt SSL is not auto-installed: click **Install** next to your domain
3. Wait ~5 minutes for propagation
4. Test: navigate to `https://jdairnet.com` — should load with padlock

---

## Step 8: Post-Deployment Verification Checklist

After uploading, verify each of these:

- [ ] `https://jdairnet.com/` — Home page loads with video hero
- [ ] `https://jdairnet.com/plans/` — Plans page with all 4 plan cards
- [ ] `https://jdairnet.com/lease-lines/` — Lease lines page with quote CTA
- [ ] `https://jdairnet.com/coverage/` — Coverage page loads
- [ ] `https://jdairnet.com/about/` — About page loads
- [ ] `https://jdairnet.com/contact/` — Contact page with form
- [ ] `https://jdairnet.com/sitemap.xml` — Sitemap loads with all URLs
- [ ] `https://jdairnet.com/robots.txt` — robots.txt loads and points to sitemap
- [ ] Contact form submit → email arrives in `info@jdairnet.com`
- [ ] Phone CTA tap → opens dialer
- [ ] WhatsApp CTA tap → opens WhatsApp
- [ ] HTTP → HTTPS redirect works (type `http://jdairnet.com/` → redirects to `https://`)
- [ ] Mobile view: sticky contact bar visible at bottom on all pages

---

## Step 9: Submit Sitemap to Google Search Console

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add property: `https://jdairnet.com`
3. Verify domain ownership (HTML file or DNS TXT record via Hostinger DNS settings)
4. Go to **Sitemaps** → Enter `sitemap.xml` → Click Submit
5. Wait 24-48 hours for Google to start indexing

---

## Re-Deployment After Updates

For every subsequent update:

```bash
# 1. Make code changes locally
# 2. Run quality gates
npm run ci:quality

# 3. Build static export
npm run build

# 4. Preview locally
npm run serve

# 5. Upload out/ contents to Hostinger public_html/ via FileZilla
#    (overwrite existing files)
# 6. If contact.php changed, re-upload it separately
```

> **Note:** `contact.php` is NOT rebuilt by `npm run build` — it is maintained and uploaded manually.

---

## GoDaddy Alternative

If deploying to GoDaddy instead of Hostinger, the process is identical except:
- Control panel is cPanel (not hPanel)
- SMTP host for PHPMailer: `smtpout.secureserver.net` (port 465)
- File Manager is under **cPanel → File Manager**
- FTP host: `ftp.jdairnet.com` (same)
