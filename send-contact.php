<?php
/**
 * Contact Form Handler with Mailjet Integration
 * Melons Logistics - Form Submission Handler
 */

// Security headers
header('Content-Type: application/json');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');

// CORS settings (adjust if needed based on your domain)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

// Load configuration file
define('MELONS_CONFIG', true);
if (!file_exists(__DIR__ . '/config.php')) {
    http_response_code(500);
    error_log('Configuration file missing: config.php not found');
    echo json_encode([
        'success' => false,
        'message' => 'Server configuration error. Please contact support at 800.977.7275.'
    ]);
    exit();
}
require_once __DIR__ . '/config.php';

// Get JSON input
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Validate required fields
$requiredFields = ['name', 'company', 'email', 'phone', 'message'];
$missingFields = [];

foreach ($requiredFields as $field) {
    if (empty($data[$field])) {
        $missingFields[] = $field;
    }
}

if (!empty($missingFields)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Missing required fields: ' . implode(', ', $missingFields)
    ]);
    exit();
}

// Sanitize inputs
$name = htmlspecialchars(trim($data['name']), ENT_QUOTES, 'UTF-8');
$company = htmlspecialchars(trim($data['company']), ENT_QUOTES, 'UTF-8');
$email = filter_var(trim($data['email']), FILTER_SANITIZE_EMAIL);
$phone = htmlspecialchars(trim($data['phone']), ENT_QUOTES, 'UTF-8');
$service = isset($data['service']) ? htmlspecialchars(trim($data['service']), ENT_QUOTES, 'UTF-8') : 'Not specified';
$message = htmlspecialchars(trim($data['message']), ENT_QUOTES, 'UTF-8');

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid email address']);
    exit();
}

// Map service codes to readable names
$serviceNames = [
    'perishable' => 'Perishable Commodities',
    'drayage' => 'Drayage & Import Services',
    'dry-goods' => 'Dry Goods',
    'intermodal' => 'Intermodal Solutions',
    'other' => 'Other'
];
$serviceName = isset($serviceNames[$service]) ? $serviceNames[$service] : $service;

// Build email content
$emailSubject = "New Contact Form Submission - Melons Logistics";
$emailHtml = "
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #009345; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background-color: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-radius: 0 0 8px 8px; }
        .field { margin-bottom: 20px; }
        .label { font-weight: bold; color: #009345; margin-bottom: 5px; display: block; }
        .value { background-color: white; padding: 12px; border-left: 3px solid #009345; border-radius: 4px; }
        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>New Contact Form Submission</h1>
            <p>Melons Logistics Website</p>
        </div>
        <div class='content'>
            <div class='field'>
                <span class='label'>Name:</span>
                <div class='value'>{$name}</div>
            </div>
            <div class='field'>
                <span class='label'>Company:</span>
                <div class='value'>{$company}</div>
            </div>
            <div class='field'>
                <span class='label'>Email:</span>
                <div class='value'><a href='mailto:{$email}'>{$email}</a></div>
            </div>
            <div class='field'>
                <span class='label'>Phone:</span>
                <div class='value'><a href='tel:{$phone}'>{$phone}</a></div>
            </div>
            <div class='field'>
                <span class='label'>Service Interest:</span>
                <div class='value'>{$serviceName}</div>
            </div>
            <div class='field'>
                <span class='label'>Message:</span>
                <div class='value'>" . nl2br($message) . "</div>
            </div>
        </div>
        <div class='footer'>
            <p>Received: " . date('F j, Y \a\t g:i A T') . "</p>
            <p>This email was sent from the Melons Logistics contact form at www.melonslogistics.com</p>
        </div>
    </div>
</body>
</html>
";

$emailText = "
NEW CONTACT FORM SUBMISSION
Melons Logistics Website

Name: {$name}
Company: {$company}
Email: {$email}
Phone: {$phone}
Service Interest: {$serviceName}

Message:
{$message}

---
Received: " . date('F j, Y \a\t g:i A T') . "
This email was sent from the Melons Logistics contact form at www.melonslogistics.com
";

// Prepare Mailjet API request
$mailjetData = [
    'Messages' => [
        [
            'From' => [
                'Email' => FROM_EMAIL,
                'Name' => FROM_NAME
            ],
            'To' => [
                [
                    'Email' => RECIPIENT_EMAIL,
                    'Name' => RECIPIENT_NAME
                ]
            ],
            'Subject' => $emailSubject,
            'TextPart' => $emailText,
            'HTMLPart' => $emailHtml,
            'ReplyTo' => [
                'Email' => $email,
                'Name' => $name
            ]
        ]
    ]
];

// Send email via Mailjet API
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'https://api.mailjet.com/v3.1/send');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($mailjetData));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json'
]);
curl_setopt($ch, CURLOPT_USERPWD, MAILJET_API_KEY . ':' . MAILJET_SECRET_KEY);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

// Log the response for debugging (only if DEBUG_MODE is enabled)
if (defined('DEBUG_MODE') && DEBUG_MODE) {
    error_log("Mailjet Response Code: {$httpCode}");
    error_log("Mailjet Response: {$response}");
}

// Check if email was sent successfully
if ($httpCode === 200) {
    $responseData = json_decode($response, true);

    if (isset($responseData['Messages'][0]['Status']) && $responseData['Messages'][0]['Status'] === 'success') {
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Thank you for contacting us! We will get back to you shortly.'
        ]);
    } else {
        // Mailjet returned 200 but message wasn't sent
        http_response_code(500);
        error_log("Mailjet Error: " . json_encode($responseData));
        echo json_encode([
            'success' => false,
            'message' => 'There was an error sending your message. Please try again or call us at 800.977.7275.'
        ]);
    }
} else {
    // HTTP error from Mailjet
    http_response_code(500);
    error_log("Mailjet HTTP Error {$httpCode}: {$response}");
    if ($curlError) {
        error_log("cURL Error: {$curlError}");
    }
    echo json_encode([
        'success' => false,
        'message' => 'There was an error sending your message. Please try again or call us at 800.977.7275.'
    ]);
}
?>
