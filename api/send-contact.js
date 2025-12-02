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
    <div class="container">
        <div class="header">
            <h1>New Contact Form Submission</h1>
            <p>Melons Logistics Website</p>
        </div>
        <div class="content">
            <div class="field">
                <span class="label">Name:</span>
                <div class="value">${name}</div>
            </div>
            <div class="field">
                <span class="label">Company:</span>
                <div class="value">${company}</div>
            </div>
            <div class="field">
                <span class="label">Email:</span>
                <div class="value"><a href="mailto:${email}">${email}</a></div>
            </div>
            <div class="field">
                <span class="label">Phone:</span>
                <div class="value"><a href="tel:${phone}">${phone}</a></div>
            </div>
            <div class="field">
                <span class="label">Service Interest:</span>
                <div class="value">${serviceName}</div>
            </div>
            <div class="field">
                <span class="label">Message:</span>
                <div class="value">${message.replace(/\n/g, '<br>')}</div>
            </div>
        </div>
        <div class="footer">
            <p>Received: ${new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'long' })}</p>
            <p>This email was sent from the Melons Logistics contact form at www.melonslogistics.com</p>
        </div>
    </div>
</body>
</html>
`;

        const emailText = `
NEW CONTACT FORM SUBMISSION
Melons Logistics Website

Name: ${name}
Company: ${company}
Email: ${email}
Phone: ${phone}
Service Interest: ${serviceName}

Message:
${message}

---
Received: ${new Date().toLocaleString()}
This email was sent from the Melons Logistics contact form at www.melonslogistics.com
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
