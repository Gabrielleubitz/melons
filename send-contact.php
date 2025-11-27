<?php
// ========================================
// CONTACT FORM EMAIL HANDLER
// ========================================

// Set headers to allow CORS (if needed)
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Get POST data
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Validate required fields
if (empty($data['name']) || empty($data['email']) || empty($data['message'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

// Sanitize inputs
$name = htmlspecialchars(strip_tags($data['name']));
$company = htmlspecialchars(strip_tags($data['company'] ?? ''));
$email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
$phone = htmlspecialchars(strip_tags($data['phone'] ?? ''));
$service = htmlspecialchars(strip_tags($data['service'] ?? 'Not specified'));
$message = htmlspecialchars(strip_tags($data['message']));

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid email address']);
    exit;
}

// Email recipients
$recipients = [
    'wfink@melonslogistics.com',
    'asher@melonslogistics.com',
    'mark@melonslogistics.com'
];

// Fallback email if individual recipients fail
$fallback_email = 'dispatch@melonslogistics.com';

// Email subject
$subject = "New Contact Form Submission from {$name}";

// Email body (HTML)
$email_body = "
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #009345; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
        .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
        .field { margin-bottom: 20px; }
        .label { font-weight: bold; color: #009345; margin-bottom: 5px; }
        .value { background-color: white; padding: 10px; border-radius: 3px; border: 1px solid #e5e5e5; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>New Contact Form Submission</h2>
        </div>
        <div class='content'>
            <div class='field'>
                <div class='label'>Name:</div>
                <div class='value'>{$name}</div>
            </div>

            <div class='field'>
                <div class='label'>Company:</div>
                <div class='value'>{$company}</div>
            </div>

            <div class='field'>
                <div class='label'>Email:</div>
                <div class='value'><a href='mailto:{$email}'>{$email}</a></div>
            </div>

            <div class='field'>
                <div class='label'>Phone:</div>
                <div class='value'>{$phone}</div>
            </div>

            <div class='field'>
                <div class='label'>Service Interest:</div>
                <div class='value'>{$service}</div>
            </div>

            <div class='field'>
                <div class='label'>Message:</div>
                <div class='value'>" . nl2br($message) . "</div>
            </div>
        </div>
        <div class='footer'>
            <p>This message was sent from the Melons Logistics contact form</p>
            <p>Received on " . date('F j, Y \a\t g:i A') . "</p>
        </div>
    </div>
</body>
</html>
";

// Plain text version for email clients that don't support HTML
$plain_text_body = "
New Contact Form Submission
============================

Name: {$name}
Company: {$company}
Email: {$email}
Phone: {$phone}
Service Interest: {$service}

Message:
{$message}

---
This message was sent from the Melons Logistics contact form
Received on " . date('F j, Y \a\t g:i A') . "
";

// Email headers
$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    'From: Melons Logistics Website <noreply@melonslogistics.com>',
    'Reply-To: ' . $email,
    'X-Mailer: PHP/' . phpversion()
];

$headers_string = implode("\r\n", $headers);

// Track email sending success
$success_count = 0;
$failed_recipients = [];

// Send email to each recipient
foreach ($recipients as $recipient) {
    if (mail($recipient, $subject, $email_body, $headers_string)) {
        $success_count++;
    } else {
        $failed_recipients[] = $recipient;
    }
}

// If all emails failed, try sending to fallback
if ($success_count === 0) {
    if (mail($fallback_email, $subject, $email_body, $headers_string)) {
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Your message has been sent successfully!',
            'note' => 'Sent to dispatch email'
        ]);
        exit;
    } else {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Failed to send email. Please try again or call us directly at 800.977.7275'
        ]);
        exit;
    }
}

// Success response
http_response_code(200);
echo json_encode([
    'success' => true,
    'message' => 'Your message has been sent successfully! We\'ll get back to you shortly.',
    'sent_to' => $success_count . ' recipient(s)'
]);

// Optional: Log the submission (uncomment if you want to keep a log)
/*
$log_entry = date('Y-m-d H:i:s') . " | {$name} | {$email} | {$company}\n";
file_put_contents('contact_submissions.log', $log_entry, FILE_APPEND);
*/
?>
