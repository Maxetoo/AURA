const sendCustomZeptoEmail = require('./emailConstruct');

const resetPasswordEmail = (details) => {
    const { email, reset_url, firstname} = details
        

        const HTML_content = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Password</title>
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
            color: #3D365C
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
        .reset-button {
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
            <p>Dear ${firstname},</p>
            <p>We've received a request to reset your AURA (AI for Understanding and Recovery Assistance) password. You can just click on the button below. This link is only valid for the next 24 hours.</p>
            <a href="${reset_url}" class="reset-button">RESET PASSWORD</a>
            <p>If you have any questions, reach us at <a href="auragroupng@gmail.com">auragroupng@gmail.com</a></p>
        </div>
        <div class="footer">
            &copy; 2025 AURA GROUP, All rights reserved.
        </div>
    </div>
</body>
</html>

`

const subject = "Password Reset";

return sendCustomZeptoEmail(email, 'User', subject, HTML_content);
}

module.exports = resetPasswordEmail