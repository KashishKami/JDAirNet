<?php
// contact.php — JDAirNet Contact Form Handler
// Deploy to: Hostinger public_html/contact.php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Collect and sanitize inputs (supports both $_POST and JSON payload)
$rawInput = file_get_contents('php://input');
$jsonData = json_decode($rawInput, true);

$name    = htmlspecialchars(trim($_POST['name'] ?? $jsonData['name'] ?? ''));
$email   = filter_var(trim($_POST['email'] ?? $jsonData['email'] ?? ''), FILTER_SANITIZE_EMAIL);
$phone   = htmlspecialchars(trim($_POST['phone'] ?? $jsonData['phone'] ?? ''));
$service = htmlspecialchars(trim($_POST['service'] ?? $jsonData['service'] ?? 'General Inquiry'));
$message = htmlspecialchars(trim($_POST['message'] ?? $jsonData['message'] ?? ''));

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
$to      = 'info@jdairnet.com';           // Target company inbox
$from    = 'noreply@jdairnet.com';        // Hostinger authenticated sender
$subject = 'New Inquiry from JDAirNet Website: ' . $service;

$body = "New contact form submission from the JDAirNet website.\n\n";
$body .= "Name:    $name\n";
$body .= "Email:   $email\n";
$body .= "Phone:   $phone\n";
$body .= "Service: $service\n";
$body .= "Message:\n$message\n";

$headers  = "From: JDAirNet Website <$from>\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// Attempt to send email
if (mail($to, $subject, $body, $headers)) {
    echo json_encode(['success' => true, 'message' => 'Thank you! Your message has been sent successfully.']);
} else {
    // If mail() fails on server, return a clear message
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to send message. Please call us directly.']);
}
?>
