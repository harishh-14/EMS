import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send Welcome Email to New Employee
 */
export const sendWelcomeEmail = async ({ name, email, password }) => {
  try {
    const mailOptions = {
      from: `"HR Team" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🎉 Welcome to the Company - Your Account Details",
      html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background: #f9fafb; border-radius: 10px;">
        <h2 style="color: #4CAF50;">Welcome aboard, ${name}! 🎉</h2>
        <p>We’re excited to have you join our team. Here are your login credentials:</p>
        <div style="background: #ffffff; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <p><strong>👤 Name:</strong> ${name}</p>
          <p><strong>📧 Email:</strong> ${email}</p>
          <p><strong>🔑 Password:</strong> ${password}</p>
        </div>
        <p style="margin-top: 20px;">👉 You can login to your employee dashboard and change your password after first login for security.</p>
        <p style="color: #555;">Best Regards,<br/>HR Team</p>
      </div>
    `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true, message: "Email sent successfully!" };
  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
    return { success: false, error: "Failed to send email" };
  }
};

const sendEmail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      service: process.env.SMTP_SERVICE, // e.g. "gmail"
      auth: {
        user: process.env.SMTP_MAIL, // your email
        pass: process.env.SMTP_PASSWORD, // your app password
      },
    });

    const mailOptions = {
      from: `"EMS Support" <${process.env.SMTP_MAIL}>`,
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("❌ Email not sent:", error);
    throw new Error("Email could not be sent");
  }
};

export default sendEmail;
