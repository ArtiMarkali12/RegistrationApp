const nodemailer = require("nodemailer");

/**
 * Create a nodemailer transporter
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: process.env.EMAIL_PORT || 587,
    secure: process.env.EMAIL_SECURE === "true", // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

/**
 * Send registration success email to student
 * @param {string} to - Student's email address
 * @param {string} studentName - Student's full name
 * @param {string} registrationNo - Registration number
 * @param {string} courseName - Course name
 */
const sendRegistrationSuccessEmail = async (to, studentName, registrationNo, courseName) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || "Registration Team"}" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: to,
      subject: "Registration Successful",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .header h1 { margin: 0; font-size: 28px; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .success-icon { font-size: 48px; text-align: center; display: block; margin-bottom: 20px; }
            .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .info-row { margin: 10px 0; }
            .label { font-weight: bold; color: #667eea; }
            .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Registration Successful!</h1>
            </div>
            <div class="content">
              <span class="success-icon">✅</span>
              <p>Dear <strong>${studentName}</strong>,</p>
              <p>Congratulations! Your registration has been completed successfully. We're excited to have you on board.</p>
              
              <div class="info-box">
                <h3 style="margin-top: 0; color: #667eea;">📋 Registration Details</h3>
                <div class="info-row"><span class="label">Registration Number:</span> ${registrationNo}</div>
                <div class="info-row"><span class="label">Course:</span> ${courseName || "Not specified"}</div>
                <div class="info-row"><span class="label">Registered Email:</span> ${to}</div>
              </div>
              
              <p>Please save your registration number for future reference. You will receive further communications regarding your course at this email address.</p>
              
              <p>If you have any questions or need assistance, please don't hesitate to contact us.</p>
              
              <p>Best Regards,<br><strong>The Registration Team</strong></p>
              
              <div class="footer">
                <p>This is an automated message. Please do not reply to this email.</p>
                <p>&copy; ${new Date().getFullYear()} All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Registration success email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending registration success email:", error.message);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendRegistrationSuccessEmail,
};
