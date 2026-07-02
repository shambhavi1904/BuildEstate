import Form from "../models/formmodel.js";
import { sendEmail } from "../config/nodemailer.js";

export const submitForm = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    // ==========================
    // Save to MongoDB
    // ==========================
    const newForm = new Form({
      name,
      email,
      phone,
      message,
    });

    await newForm.save();

    // ==========================
    // Send Email to Admin
    // ==========================
    await sendEmail({
      to: process.env.CONTACT_EMAIL,
      subject: "📩 New Contact Form Submission - BuildEstate",
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6">

          <h2 style="color:#2563eb;">
            New Contact Form Submission
          </h2>

          <p><strong>Name:</strong> ${name}</p>

          <p><strong>Email:</strong> ${email}</p>

          <p><strong>Phone:</strong> ${
            phone || "Not Provided"
          }</p>

          <hr>

          <h3>Message</h3>

          <div style="
            background:#f4f4f4;
            padding:15px;
            border-radius:8px;
          ">
            ${message}
          </div>

          <br>

          <small>
            This enquiry was submitted from the BuildEstate website.
          </small>

        </div>
      `,
    });

    // ==========================
    // Auto Reply to Customer
    // ==========================
    await sendEmail({
      to: email,
      subject: "🏡 Thank You for Contacting BuildEstate",
      html: `
        <div style="
          max-width:600px;
          margin:auto;
          font-family:Arial,sans-serif;
          line-height:1.6;
          padding:20px;
          border:1px solid #ddd;
          border-radius:10px;
        ">

          <h2 style="color:#2563eb;">
            Hello ${name},
          </h2>

          <p>
            Thank you for contacting <strong>BuildEstate</strong>.
          </p>

          <p>
            We have successfully received your enquiry.
            Our team will contact you as soon as possible.
          </p>

          <hr>

          <h3>Your Submitted Details</h3>

          <p><strong>Name:</strong> ${name}</p>

          <p><strong>Email:</strong> ${email}</p>

          <p><strong>Phone:</strong> ${
            phone || "Not Provided"
          }</p>

          <p><strong>Your Message:</strong></p>

          <div style="
            background:#f4f4f4;
            padding:15px;
            border-radius:8px;
          ">
            ${message}
          </div>

          <br>

          <p>
            Thank you for choosing BuildEstate.
          </p>

          <p>
            Regards,<br>
            <strong>BuildEstate Team</strong>
          </p>

        </div>
      `,
    });

    res.status(200).json({
      success: true,
      message: "Form submitted successfully",
    });

  } catch (error) {
    console.error("Contact Form Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};