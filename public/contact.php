<?php
/**
 * contact.php — JDAirNet Contact Form Handler
 * Optimized for GoDaddy cPanel & Linux Shared Hosting
 *
 * Receiver: support@jdairnet.com
 * Sender:   noreply@jdairnet.com
 */

// Enable CORS and JSON Response Headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');
header('Content-Type: application/json; charset=UTF-8');

// Handle CORS Preflight OPTIONS Request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method Not Allowed. Only POST requests are accepted.'
    ]);
    exit;
}

// ── 1. Input Collection & Parsing ────────────────────────────────────────
// Supports both FormData/POST and raw JSON payload
$rawInput = file_get_contents('php://input');
$jsonData = json_decode($rawInput, true);

$nameVal    = $_POST['name']    ?? $jsonData['name']    ?? '';
$emailVal   = $_POST['email']   ?? $jsonData['email']   ?? '';
$phoneVal   = $_POST['phone']   ?? $jsonData['phone']   ?? '';
$serviceVal = $_POST['service'] ?? $jsonData['service'] ?? 'General Inquiry';
$messageVal = $_POST['message'] ?? $jsonData['message'] ?? '';
$honeypot   = $_POST['website_url'] ?? $jsonData['website_url'] ?? '';

// Honeypot anti-spam check (if bot fills hidden field, return success silently)
if (!empty($honeypot)) {
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Thank you! Your message has been received.'
    ]);
    exit;
}

// ── 2. Sanitization & Header Injection Protection ────────────────────────
// Strip newlines to prevent email header injection
function sanitize_header_value($value) {
    return preg_replace('/[\r\n]+/', ' ', trim($value));
}

$name    = htmlspecialchars(sanitize_header_value($nameVal), ENT_QUOTES, 'UTF-8');
$email   = filter_var(trim($emailVal), FILTER_SANITIZE_EMAIL);
$phone   = htmlspecialchars(sanitize_header_value($phoneVal), ENT_QUOTES, 'UTF-8');
$service = htmlspecialchars(sanitize_header_value($serviceVal), ENT_QUOTES, 'UTF-8');
$message = htmlspecialchars(trim($messageVal), ENT_QUOTES, 'UTF-8');

// ── 3. Validation ────────────────────────────────────────────────────────
if (empty($name) || empty($email) || empty($message)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Please provide your full name, email address, and message.'
    ]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Please provide a valid email address.'
    ]);
    exit;
}

// ── 4. Email Configuration (GoDaddy Hosting Tuned) ───────────────────────
$to       = 'support@jdairnet.com';           // Receiver Mailbox
$from     = 'noreply@jdairnet.com';          // GoDaddy Authenticated Sender Domain
$subject  = 'New Inquiry from JDAirNet Website: ' . $service;

// User metadata for inquiry context
$clientIp  = $_SERVER['REMOTE_ADDR'] ?? 'Unknown';
$timestamp = date('d M Y, h:i A T');

// HTML Formatted Email Body
$body = '
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>New Website Inquiry</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 20px; color: #1e293b; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08); border: 1px solid #e2e8f0; }
    .header { background: #c81e2b; padding: 24px; text-align: center; color: #ffffff; }
    .header h1 { margin: 0; font-size: 20px; font-weight: 700; letter-spacing: 0.5px; }
    .content { padding: 24px 30px; }
    .field-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    .field-table td { padding: 10px 0; border-bottom: 1px solid #f1f5f9; vertical-align: top; }
    .field-label { width: 32%; font-weight: 600; color: #64748b; font-size: 14px; }
    .field-value { width: 68%; color: #0f172a; font-size: 15px; font-weight: 500; }
    .message-box { background: #f8fafc; border-left: 4px solid #c81e2b; padding: 16px; border-radius: 4px; font-size: 14px; line-height: 1.6; color: #334155; margin-top: 10px; white-space: pre-wrap; }
    .footer { background: #f8fafc; padding: 16px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New JDAirNet Website Inquiry</h1>
    </div>
    <div class="content">
      <table class="field-table">
        <tr>
          <td class="field-label">Customer Name</td>
          <td class="field-value"><strong>' . $name . '</strong></td>
        </tr>
        <tr>
          <td class="field-label">Email Address</td>
          <td class="field-value"><a href="mailto:' . $email . '" style="color: #c81e2b; text-decoration: none;">' . $email . '</a></td>
        </tr>
        <tr>
          <td class="field-label">Phone Number</td>
          <td class="field-value">' . ($phone ? '<a href="tel:' . $phone . '" style="color: #0f172a; text-decoration: none;">' . $phone . '</a>' : '<em>Not Provided</em>') . '</td>
        </tr>
        <tr>
          <td class="field-label">Service Requested</td>
          <td class="field-value"><span style="background: #e0f2fe; color: #0369a1; padding: 3px 8px; border-radius: 9999px; font-size: 13px; font-weight: 600;">' . $service . '</span></td>
        </tr>
      </table>

      <div style="font-weight: 600; color: #64748b; font-size: 14px; margin-top: 16px;">Message / Inquiry Details:</div>
      <div class="message-box">' . nl2br($message) . '</div>
    </div>
    <div class="footer">
      Submitted on ' . $timestamp . ' • IP: ' . $clientIp . '<br>
      JDAirNet Internet Services — High-Speed Fiber Connectivity
    </div>
  </div>
</body>
</html>
';

// ── 5. Email Headers (GoDaddy MTA Compliant) ─────────────────────────────
$headers   = [];
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'Content-type: text/html; charset=UTF-8';
$headers[] = 'From: JDAirNet Website <' . $from . '>';
$headers[] = 'Reply-To: ' . $name . ' <' . $email . '>';
$headers[] = 'X-Mailer: PHP/' . phpversion();
$headerString = implode("\r\n", $headers);

// ── 6. Send Email using PHP mail() with -f Envelope Sender ────────────────
// Note: GoDaddy cPanel requires passing "-f" . $from as 5th parameter to prevent SPF/Return-Path spoofing errors
$mailSent = @mail($to, $subject, $body, $headerString, "-f" . $from);

if ($mailSent) {
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Thank you! Your message has been sent successfully. Our team will contact you shortly.'
    ]);
} else {
    // Fallback: Retry without -f parameter if environment restricts extra parameters
    $fallbackSent = @mail($to, $subject, $body, $headerString);
    if ($fallbackSent) {
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Thank you! Your message has been sent successfully. Our team will contact you shortly.'
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Failed to send message via mail server. Please contact us directly via phone or WhatsApp.'
        ]);
    }
}
?>
