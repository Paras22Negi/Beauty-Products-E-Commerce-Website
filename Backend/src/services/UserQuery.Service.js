import transporter from "../config/transporter.js";
import { sendUserQueryConfirmationEmail } from "../config/sendUserQueryConfirmationEmail.js";
import userQueryModel from "../Models/userQuery.Model.js";
import dotenv from "dotenv";
dotenv.config();

const OWNER_EMAIL = process.env.OWNER_EMAIL;

const saveUserQuery = async ({ name, phone, message, user }) => {
  const query = new userQueryModel({ name, phone, message, user: user._id });
  const saved = await query.save();
  console.log("📩 Sending user confirmation to:", user.email);
  console.log("📨 Sending owner alert to:", OWNER_EMAIL);

  // Email to Fluteon support
  await transporter.sendMail({
    from: '"MARS Cosmetics Clone" <venusgarments@gmail.com>',
    to: OWNER_EMAIL,
    subject: "📨 New Customer Query",
    html: `
      <h3>📥 Query Received</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>Message:</strong><br/>${message}</p>
    `,
  });

  // Send confirmation email to the user
  await sendUserQueryConfirmationEmail(user.email, name, message);

  return saved;
};

export default saveUserQuery;
