import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, // smtp.gmail.com
  port: process.env.SMTP_PORT, // 587
  secure: false, // Gmail uses TLS on port 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendUserQueryConfirmationEmail = async (to, name, message) => {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2 style="color: #5c4dff;">Hi ${name},</h2>
      <p>Thank you for reaching out to <span style="color: #FF4C60;">MARS Cosmetics Clone</span>! 🎉</p>

      <h3>📝 Query Summary</h3>
      <p><strong>Your Message:</strong></p>
      <blockquote style="border-left: 4px solid #ccc; padding-left: 12px; color: #555;">
        ${message}
      </blockquote>

      <p>We’ve received your query and our support team will get in touch with you shortly.</p>

      <hr style="margin: 20px 0;" />
      <p style="font-size: 0.9em; color: #777;">In the meantime, feel free to explore our website or reply to this email if you have more information to share.</p>
      <p style="color: #aaa;">– -By Paras Negi</p>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_USER}>`,
      to,
      replyTo: process.env.REPLY_TO_EMAIL,
      subject: "🤝 We've received your query - Fluteon",
      html: htmlContent,
    });

    console.log(
      "✅ Query confirmation email sent:",
      info.messageId || info.response
    );
  } catch (err) {
    console.error("❌ Failed to send query confirmation email:", err.message);
  }
};

export { sendUserQueryConfirmationEmail };