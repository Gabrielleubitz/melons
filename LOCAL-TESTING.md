# Local Testing Guide for Melons Logistics Website

## The Problem

You're seeing this error because PHP files need a PHP server to execute. When you run a regular HTTP server (like `live-server` on port 3000), it can't process PHP files - they're either returned as plain text or give a 405 error.

**Error you're seeing:**
```
POST http://127.0.0.1:3000/send-contact.php 405 (Method Not Allowed)
```

## Solutions

### Option 1: Test on Live Server (Recommended)

The easiest way is to test the contact form directly on your live website:

1. Go to **https://www.melonslogistics.com/contact.html**
2. Fill out the form
3. Submit it
4. Check **gabrielleubitz@gmail.com** for the email

This works because your hosting server has PHP installed and configured.

### Option 2: Install PHP Locally (For Development)

If you want to test PHP locally, you need to install PHP first:

#### Step 1: Fix Homebrew Permissions (one-time setup)
```bash
sudo chown -R $(whoami) /usr/local/Homebrew
```

#### Step 2: Install PHP
```bash
brew install php
```

#### Step 3: Start PHP Development Server
```bash
cd /Users/GabrielLeubitz/Downloads/melons
php -S localhost:8000
```

#### Step 4: Access Your Site
Open your browser to: **http://localhost:8000/contact.html**

Now the form will work because PHP is processing the files!

### Option 3: Quick Test Without PHP

For quick HTML/CSS/JS testing (not form submission), you can continue using your current setup on port 3000. Just ignore the form errors - test everything else!

## Other Errors You Might See

These are from browser extensions and can be ignored:

- ❌ `contentScript.js` errors - Browser extension (not your code)
- ❌ `IMAGE_URL_TRUCK_ROAD 404` - Extension trying to load images
- ❌ `Mapify:warn` - Extension looking for elements

These don't affect your website!

## Current Setup Status

✅ **config.php** - Created locally with API keys  
✅ **Code deployed** - Already on melonslogistics.com  
✅ **Form working** - Ready to test on live site  
⚠️ **Local PHP** - Not installed (optional for testing)

## Production Checklist

When ready to go live with Asher's email:

1. Edit `config.php`:
   ```php
   define('RECIPIENT_EMAIL', 'asher@melonslogistics.com');
   define('ENVIRONMENT', 'production');
   define('DEBUG_MODE', false);
   ```

2. Upload to server (if not already there)

3. Test the form on live site

4. Verify email arrives at Asher's inbox

## Need Help?

- Can't receive test emails? Check spam folder
- API errors? Verify Mailjet API keys are correct in config.php
- Still having issues? Contact gabrielleubitz@gmail.com
