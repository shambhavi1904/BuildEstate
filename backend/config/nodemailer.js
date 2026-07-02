import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Optional: Verify transporter on server start
transporter.verify((error, success) => {
  if (error) {
    console.log("❌ Email configuration error:");
    console.log(error.message);
  } else {
    console.log("✅ Gmail is ready to send emails");
  }
});

export const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `"BuildEstate" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    return true;
  } catch (error) {
    console.error("Email Error:", error);
    return false;
  }
};

export const checkEmailHealth = async () => {
  try {
    await transporter.verify();

    return {
      status: "healthy",
      message: "Email service is working",
    };
  } catch (error) {
    return {
      status: "error",
      message: error.message,
    };
  }
};

export default transporter;