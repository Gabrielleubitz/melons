<?php
/**
 * Melons Logistics Configuration File Template
 * 
 * SETUP INSTRUCTIONS:
 * 1. Copy this file to config.php
 * 2. Fill in your actual API credentials and settings
 * 3. Never commit config.php to version control
 */

// Prevent direct access
if (!defined('MELONS_CONFIG')) {
    http_response_code(403);
    die('Direct access not permitted');
}

// Mailjet API Configuration
// Get your API keys from: https://app.mailjet.com/account/api_keys
define('MAILJET_API_KEY', 'your_mailjet_api_key_here');
define('MAILJET_SECRET_KEY', 'your_mailjet_secret_key_here');

// Email Configuration
define('RECIPIENT_EMAIL', 'recipient@example.com'); // Email address to receive form submissions
define('RECIPIENT_NAME', 'Recipient Name');
define('FROM_EMAIL', 'noreply@melonslogistics.com');
define('FROM_NAME', 'Melons Logistics Website');

// Environment (development, staging, production)
define('ENVIRONMENT', 'development');

// Enable/disable error logging (set to false in production)
define('DEBUG_MODE', true);
?>
