import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendUserQueryConfirmationEmail = async (to, name, subject, message) => {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0;">MARS Cosmetics</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Thank you for contacting us!</p>
      </div>
      
      <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
        <h2 style="color: #1f2937; margin-top: 0;">Hi ${name},</h2>
        
        <p style="color: #4b5563; line-height: 1.6;">
          We've received your message and our support team will get back to you within 24-48 hours.
        </p>

        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">📝 Your Query Summary</h3>
          <p style="margin: 8px 0;"><strong>Subject:</strong> ${subject}</p>
          <p style="margin: 8px 0;"><strong>Message:</strong></p>
          <blockquote style="border-left: 4px solid #ec4899; padding-left: 16px; margin: 10px 0; color: #6b7280;">
            ${message}
          </blockquote>
        </div>

        <p style="color: #4b5563; line-height: 1.6;">
          In the meantime, feel free to explore our latest products or reply to this email if you have more information to share.
        </p>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
        
        <p style="color: #9ca3af; font-size: 12px; text-align: center;">
          This is an automated confirmation email. Please do not reply directly to this email.
          <br />
          © ${new Date().getFullYear()} MARS Cosmetics. All rights reserved.
        </p>
      </div>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"MARS Cosmetics" <${process.env.SMTP_USER}>`,
      to,
      replyTo: process.env.REPLY_TO_EMAIL || process.env.OWNER_EMAIL,
      subject: `✅ We've received your query: ${subject}`,
      html: htmlContent,
    });

    console.log(
      "✅ Query confirmation email sent:",
      info.messageId || info.response
    );
  } catch (err) {
    console.error("❌ Failed to send query confirmation email:", err.message);
    throw err;
  }
};

export { sendUserQueryConfirmationEmail };
