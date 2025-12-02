// Vercel Serverless Function - Contact Form Handler
// Uses Mailjet API to send emails

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    // Handle OPTIONS request for CORS
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    try {
        // Get environment variables
        const MAILJET_API_KEY = process.env.MAILJET_API_KEY;
        const MAILJET_SECRET_KEY = process.env.MAILJET_SECRET_KEY;
        const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL || 'gabrielleubitz@gmail.com';
        const RECIPIENT_NAME = process.env.RECIPIENT_NAME || 'Asher Grossman';

        if (!MAILJET_API_KEY || !MAILJET_SECRET_KEY) {
            console.error('Missing Mailjet credentials');
            return res.status(500).json({
                success: false,
                message: 'Server configuration error. Please contact support.'
            });
        }

        // Parse request body
        const data = req.body;

        // Validate required fields
        const requiredFields = ['name', 'company', 'email', 'phone', 'message'];
        const missingFields = requiredFields.filter(field => !data[field]);

        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: ' + missingFields.join(', ')
            });
        }

        // Sanitize inputs
        const name = String(data.name).trim();
        const company = String(data.company).trim();
        const email = String(data.email).trim();
        const phone = String(data.phone).trim();
        const service = data.service ? String(data.service).trim() : 'Not specified';
        const message = String(data.message).trim();

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, message: 'Invalid email address' });
        }

        // Map service codes
        const serviceNames = {
            'perishable': 'Perishable Commodities',
            'drayage': 'Drayage & Import Services',
            'dry-goods': 'Dry Goods',
            'intermodal': 'Intermodal Solutions',
            'other': 'Other'
        };
        const serviceName = serviceNames[service] || service;

        // Build email HTML
        const emailHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Raleway', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            line-height: 1.6;
            color: #2c3e50;
            background-color: #f4f4f4;
            padding: 20px;
        }
        .email-wrapper {
            max-width: 650px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 147, 69, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #009345 0%, #007535 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
        }
        .logo {
            max-width: 220px;
            height: auto;
            margin: 0 auto 20px;
            display: block;
        }
        .header h1 {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 8px;
            letter-spacing: -0.5px;
        }
        .header p {
            font-size: 15px;
            opacity: 0.95;
            font-weight: 400;
        }
        .badge {
            display: inline-block;
            background-color: rgba(255, 255, 255, 0.2);
            padding: 6px 16px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 600;
            margin-top: 12px;
            letter-spacing: 0.5px;
        }
        .content {
            padding: 40px 35px;
            background-color: #ffffff;
        }
        .intro {
            font-size: 16px;
            color: #2c3e50;
            margin-bottom: 30px;
            padding-bottom: 25px;
            border-bottom: 2px solid #f0f0f0;
        }
        .intro strong {
            color: #009345;
            font-weight: 600;
        }
        .contact-grid {
            display: table;
            width: 100%;
            margin-bottom: 30px;
        }
        .contact-row {
            display: table-row;
        }
        .contact-cell {
            display: table-cell;
            padding: 14px 0;
            vertical-align: top;
            border-bottom: 1px solid #f0f0f0;
        }
        .contact-label {
            font-weight: 600;
            color: #009345;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            width: 140px;
            padding-right: 20px;
        }
        .contact-value {
            color: #2c3e50;
            font-size: 15px;
            font-weight: 500;
        }
        .contact-value a {
            color: #009345;
            text-decoration: none;
            font-weight: 600;
        }
        .contact-value a:hover {
            text-decoration: underline;
        }
        .message-section {
            background-color: #f8fdf9;
            border-left: 4px solid #009345;
            padding: 20px 24px;
            border-radius: 6px;
            margin: 25px 0;
        }
        .message-label {
            font-weight: 600;
            color: #009345;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            margin-bottom: 12px;
        }
        .message-content {
            color: #2c3e50;
            font-size: 15px;
            line-height: 1.7;
            white-space: pre-wrap;
        }
        .action-buttons {
            margin-top: 30px;
            padding-top: 25px;
            border-top: 2px solid #f0f0f0;
            text-align: center;
        }
        .btn {
            display: inline-block;
            padding: 14px 28px;
            margin: 0 8px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            font-size: 14px;
            letter-spacing: 0.3px;
            transition: all 0.3s;
        }
        .btn-primary {
            background-color: #009345;
            color: white;
        }
        .btn-secondary {
            background-color: #ffffff;
            color: #009345;
            border: 2px solid #009345;
        }
        .footer {
            background-color: #f8f9fa;
            padding: 25px 35px;
            text-align: center;
            font-size: 13px;
            color: #6c757d;
            border-top: 1px solid #e9ecef;
        }
        .footer-time {
            font-weight: 600;
            color: #495057;
            margin-bottom: 8px;
        }
        .footer-link {
            color: #009345;
            text-decoration: none;
            font-weight: 600;
        }
        @media only screen and (max-width: 600px) {
            .logo { max-width: 180px; margin-bottom: 15px; }
            .header h1 { font-size: 24px; }
            .contact-grid { display: block; }
            .contact-row { display: block; }
            .contact-cell { display: block; padding: 10px 0; }
            .contact-label { width: 100%; padding-bottom: 4px; }
            .btn { display: block; margin: 8px 0; }
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <div class="header">
            <img src="https://www.melonslogistics.com/assets/Melons%20Logistics%20Calendar%20logo_White-01.png" alt="Melons Logistics" class="logo">
            <h1>🚛 New Lead Inquiry</h1>
            <p>Melons Logistics Contact Form</p>
            <div class="badge">REQUIRES RESPONSE</div>
        </div>

        <div class="content">
            <div class="intro">
                A new contact form submission has been received from <strong>${name}</strong> at <strong>${company}</strong>.
            </div>

            <table class="contact-grid" role="presentation">
                <tr class="contact-row">
                    <td class="contact-cell contact-label">Contact Name</td>
                    <td class="contact-cell contact-value">${name}</td>
                </tr>
                <tr class="contact-row">
                    <td class="contact-cell contact-label">Company</td>
                    <td class="contact-cell contact-value">${company}</td>
                </tr>
                <tr class="contact-row">
                    <td class="contact-cell contact-label">Email Address</td>
                    <td class="contact-cell contact-value">
                        <a href="mailto:${email}">${email}</a>
                    </td>
                </tr>
                <tr class="contact-row">
                    <td class="contact-cell contact-label">Phone Number</td>
                    <td class="contact-cell contact-value">
                        <a href="tel:${phone}">${phone}</a>
                    </td>
                </tr>
                <tr class="contact-row">
                    <td class="contact-cell contact-label">Service Interest</td>
                    <td class="contact-cell contact-value">${serviceName}</td>
                </tr>
            </table>

            <div class="message-section">
                <div class="message-label">Customer Message</div>
                <div class="message-content">${message}</div>
            </div>

            <div class="action-buttons">
                <a href="mailto:${email}" class="btn btn-primary">Reply to ${name}</a>
                <a href="tel:${phone}" class="btn btn-secondary">Call ${phone}</a>
            </div>
        </div>

        <div class="footer">
            <div class="footer-time">Received ${new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}</div>
            <div>Submitted via <a href="https://www.melonslogistics.com/contact.html" class="footer-link">melonslogistics.com</a></div>
        </div>
    </div>
</body>
</html>
`;

        const emailText = `
🚛 NEW LEAD INQUIRY
Melons Logistics Contact Form

A new contact form submission has been received from ${name} at ${company}.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CONTACT INFORMATION

Contact Name:      ${name}
Company:           ${company}
Email Address:     ${email}
Phone Number:      ${phone}
Service Interest:  ${serviceName}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CUSTOMER MESSAGE

${message}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Received: ${new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}
Submitted via: www.melonslogistics.com/contact.html

Reply: mailto:${email}
Call: tel:${phone}
`;

        // Prepare Mailjet API request
        const mailjetData = {
            Messages: [
                {
                    From: {
                        Email: 'dispatch@melonslogistics.com', // Verified sender in Mailjet
                        Name: 'Melons Logistics Website'
                    },
                    To: [
                        {
                            Email: RECIPIENT_EMAIL,
                            Name: RECIPIENT_NAME
                        }
                    ],
                    Subject: 'New Contact Form Submission - Melons Logistics',
                    TextPart: emailText,
                    HTMLPart: emailHtml,
                    ReplyTo: {
                        Email: email,
                        Name: name
                    }
                }
            ]
        };

        // Send via Mailjet API
        const mailjetAuth = Buffer.from(MAILJET_API_KEY + ':' + MAILJET_SECRET_KEY).toString('base64');

        const response = await fetch('https://api.mailjet.com/v3.1/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + mailjetAuth
            },
            body: JSON.stringify(mailjetData)
        });

        const responseData = await response.json();

        // Log full response for debugging
        console.log('Mailjet API response status:', response.status);
        console.log('Mailjet API response body:', JSON.stringify(responseData, null, 2));

        if (response.ok && responseData.Messages && responseData.Messages[0].Status === 'success') {
            console.log('Email sent successfully to:', RECIPIENT_EMAIL);
            return res.status(200).json({
                success: true,
                message: 'Thank you for contacting us! We will get back to you shortly.'
            });
        } else {
            // Log detailed error information
            console.error('Mailjet API error - Status:', response.status);
            console.error('Mailjet API error - Response:', JSON.stringify(responseData, null, 2));
            if (responseData.Messages && responseData.Messages[0]) {
                console.error('Message error details:', responseData.Messages[0].Errors || 'No error details');
            }
            return res.status(500).json({
                success: false,
                message: 'There was an error sending your message. Please try again or call us at 800.977.7275.'
            });
        }

    } catch (error) {
        console.error('Error processing form:', error);
        return res.status(500).json({
            success: false,
            message: 'There was an error sending your message. Please try again or call us at 800.977.7275.'
        });
    }
}
