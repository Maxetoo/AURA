const sendCustomZeptoEmail = require('./emailConstruct');

const verifyAccountEmail = (email, firstname, verification_url) => {
    

    const HTML_content = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Account</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            font-size: 24px;
            font-weight: bold;
            color: #3D365C;
        }
        .content {
            margin: 20px 0;
            font-size: 16px;
            line-height: 1.6;
            color: #333333;
        }
        .content p {
            margin: 10px 0;
        }
        .verify-button {
            display: block;
            width: 100%;
            max-width: 200px;
            margin: 20px auto;
            padding: 12px 0;
            text-align: center;
            background-color: #3D365C;
            color: #ffffff;
            text-decoration: none;
            font-weight: bold;
            border-radius: 5px;
        }
        .footer {
            margin-top: 30px;
            font-size: 14px;
            text-align: center;
            color: #666666;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            AURA
        </div>
        <div class="content">
            <p>Hi ${firstname},</p>
            <p>Thank you for signing up with AURA (AI for Understanding and Recovery Assistance). To complete your registration, please verify your email address by clicking the button below.</p>
            <a href="${verification_url}" class="verify-button">VERIFY EMAIL</a>
            <p>This link is only valid for the next 24 hours. If you did not create this account, please ignore this email.</p>
            <p>Need help? Reach us at <a href="mailto:auragroupng@gmail.com">auragroupng@gmail.com</a></p>
        </div>
        <div class="footer">
            &copy; 2025 AURA GROUP, All rights reserved.
        </div>
    </div>
</body>
</html>
    `;

    const subject = "Verify Your AURA Account";

    return sendCustomZeptoEmail(email, firstname, subject, HTML_content);
};

module.exports = verifyAccountEmail;
