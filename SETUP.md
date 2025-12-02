# Melons Logistics - Email Configuration Setup

## Initial Setup

When deploying this website to a new server, follow these steps to configure the email system:

### 1. Create Configuration File

```bash
cp config.example.php config.php
```

### 2. Edit Configuration

Open `config.php` and update the following values:

```php
// Mailjet API credentials
define('MAILJET_API_KEY', 'your_actual_api_key');
define('MAILJET_SECRET_KEY', 'your_actual_secret_key');

// Email recipient (where form submissions go)
define('RECIPIENT_EMAIL', 'asher@melonslogistics.com'); // Change from testing email
define('RECIPIENT_NAME', 'Asher Grossman');

// Environment setting
define('ENVIRONMENT', 'production'); // Change to 'production' when live
define('DEBUG_MODE', false); // Disable debug logging in production
```

### 3. Verify File Permissions

Ensure `config.php` has restrictive permissions:

```bash
chmod 600 config.php
```

### 4. Test the Form

1. Navigate to www.melonslogistics.com/contact.html
2. Fill out and submit the contact form
3. Verify email is received at the configured recipient address

## Security Notes

- **Never commit `config.php`** to version control (it's already in `.gitignore`)
- Store sensitive credentials only in `config.php`
- Keep `config.example.php` updated as a template, but without real credentials
- Consider using environment variables for even better security on production servers

## Current Configuration

**Testing:** Emails currently go to `gabrielleubitz@gmail.com`

**Production:** Change `RECIPIENT_EMAIL` to `asher@melonslogistics.com` or the appropriate email

## Mailjet API Information

- Dashboard: https://app.mailjet.com/
- API Keys: https://app.mailjet.com/account/api_keys
- Documentation: https://dev.mailjet.com/

## Troubleshooting

If emails aren't sending:

1. Check that `config.php` exists and has correct credentials
2. Verify Mailjet API keys are active
3. Check server error logs for detailed error messages
4. Ensure PHP has cURL extension enabled
5. Verify the sender email domain is validated in Mailjet

For issues, contact: gabrielleubitz@gmail.com
