# Melons Logistics - Deployment Notes

## Contact Form Email Setup

The contact form has been configured to send emails to the following recipients:

- Will Fink - wfink@melonslogistics.com
- Asher Grossman - asher@melonslogistics.com
- Mark Heise - mark@melonslogistics.com

**Fallback Email:** dispatch@melonslogistics.com (used if all individual emails fail)

## Files Added/Modified

### New Files:
- `send-contact.php` - PHP backend handler for contact form submissions

### Modified Files:
- `script.js` - Updated contact form to send data to PHP backend (lines 217-241)

## Deployment Requirements

### Server Requirements:
1. **PHP Support**: The server must support PHP (version 7.0 or higher recommended)
2. **Mail Function**: PHP's `mail()` function must be enabled and configured
3. **SMTP Configuration**: The server needs proper SMTP configuration to send emails

### Deployment Steps:

1. **Upload all files** to your web server via FTP/SFTP or hosting control panel

2. **Verify PHP mail configuration:**
   - Check that PHP's `mail()` function is enabled
   - Ensure your server has a proper SMTP relay configured
   - Test the mail function with a simple PHP script if needed

3. **File Permissions:**
   - Ensure `send-contact.php` has proper read/execute permissions (typically 644 or 755)
   - If logging is enabled (commented out by default), ensure write permissions for logs

4. **Test the Contact Form:**
   - Submit a test message through the contact form
   - Verify that emails are received by all recipients
   - Check spam folders if emails don't arrive

### Alternative Deployment Options:

If PHP `mail()` function doesn't work or isn't available on your server, consider these alternatives:

#### Option 1: Use a Third-Party Email Service (Recommended)
Services like SendGrid, Mailgun, or Amazon SES provide reliable email delivery:
- More reliable than PHP `mail()`
- Better deliverability (less likely to end up in spam)
- Email tracking and analytics
- Easy to implement

#### Option 2: Use a Form Service
Services like Formspree, Netlify Forms, or Basin:
- No backend code required
- Simple HTML form integration
- Built-in spam protection
- Email notifications included

#### Option 3: Configure SMTP Directly in PHP
Use PHPMailer library for better control:
- More reliable than `mail()`
- Supports authentication
- Better error handling

## Current Configuration

The form sends to these three email addresses with HTML-formatted messages including:
- Contact name
- Company name
- Email address
- Phone number
- Service interest
- Message content
- Timestamp

## Troubleshooting

### Emails not being received:
1. Check server error logs for PHP errors
2. Verify SMTP is configured on your server
3. Check spam/junk folders
4. Verify email addresses are correct
5. Test with a simple PHP mail script

### Form not submitting:
1. Check browser console for JavaScript errors
2. Verify `send-contact.php` path is correct
3. Check server supports POST requests
4. Verify CORS headers if needed

## Security Notes

- All inputs are sanitized to prevent XSS attacks
- Email validation is performed server-side
- Form only accepts POST requests
- Consider adding rate limiting to prevent spam
- Consider adding reCAPTCHA for additional spam protection

## Need Help?

Contact your web hosting provider to:
- Confirm PHP mail support
- Configure SMTP settings
- Set up email authentication (SPF, DKIM, DMARC)
- Troubleshoot email delivery issues
