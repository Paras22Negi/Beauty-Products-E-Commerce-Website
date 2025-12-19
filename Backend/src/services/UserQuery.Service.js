import transporter from "../config/transporter.js";
import { sendUserQueryConfirmationEmail } from "../config/sendUserQueryConfirmationEmail.js";
import userQueryModel from "../Models/userQuery.Model.js";
import dotenv from "dotenv";
dotenv.config();

const OWNER_EMAIL = process.env.OWNER_EMAIL;

const saveUserQuery = async ({
  name,
  email,
  subject,
  message,
  userId = null,
}) => {
  // Save query to database
  const query = new userQueryModel({
    name,
    email,
    subject,
    message,
    user: userId,
  });
  const saved = await query.save();

  console.log("📩 Sending user confirmation to:", email);
  console.log("📨 Sending owner alert to:", OWNER_EMAIL);

  // Email to store owner/support
  try {
    await transporter.sendMail({
      from: '"MARS Cosmetics" <venusgarments@gmail.com>',
      to: OWNER_EMAIL,
      subject: `📨 New Contact Query: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ec4899;">📥 New Contact Form Submission</h2>
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p style="background: white; padding: 15px; border-radius: 4px;">${message}</p>
          </div>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            Received on: ${new Date().toLocaleString()}
          </p>
        </div>
      `,
    });
  } catch (err) {
    console.error("Failed to send owner notification email:", err.message);
  }

  // Send confirmation email to the user
  try {
    await sendUserQueryConfirmationEmail(email, name, subject, message);
  } catch (err) {
    console.error("Failed to send user confirmation email:", err.message);
  }

  return saved;
};

// Get all queries (for admin)
const getAllQueries = async () => {
  const queries = await userQueryModel
    .find()
    .populate("user", "email username")
    .sort({ createdAt: -1 });
  return queries;
};

// Update query status (for admin)
const updateQueryStatus = async (queryId, status) => {
  const query = await userQueryModel.findByIdAndUpdate(
    queryId,
    { status },
    { new: true }
  );
  return query;
};

// Delete a query (for admin)
const deleteQuery = async (queryId) => {
  const query = await userQueryModel.findByIdAndDelete(queryId);
  return query;
};

export { saveUserQuery, getAllQueries, updateQueryStatus, deleteQuery };
export default saveUserQuery;
