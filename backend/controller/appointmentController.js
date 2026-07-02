import Appointment from "../models/appointmentModel.js";
import Property from "../models/propertymodel.js";
import User from "../models/Usermodel.js";
import { sendEmail } from "../config/nodemailer.js";

/* =====================================================
   Schedule Viewing
===================================================== */

export const scheduleViewing = async (req, res) => {
  try {
    const { propertyId, date, time, notes } = req.body;

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    const alreadyBooked = await Appointment.findOne({
      propertyId,
      date,
      time,
      status: { $ne: "cancelled" },
    });

    if (alreadyBooked) {
      return res.status(400).json({
        success: false,
        message: "Selected slot is already booked.",
      });
    }

    const appointment = await Appointment.create({
      propertyId,
      userId: req.user._id,
      date,
      time,
      notes,
      status: "pending",
    });

    await appointment.populate("propertyId");
    await appointment.populate("userId", "name email");

    return res.status(201).json({
      success: true,
      message: "Viewing scheduled successfully.",
      appointment,
    });

  } catch (err) {
    console.error("Schedule Error:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* =====================================================
   Get Logged In User Appointments
===================================================== */

export const getAppointmentsByUser = async (req, res) => {
  try {

    const appointments = await Appointment.find({
      userId: req.user._id,
    })
      .populate("propertyId")
      .sort({
        createdAt: -1,
      });

    return res.json({
      success: true,
      appointments,
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};

/* =====================================================
   Cancel Appointment
===================================================== */

export const cancelAppointment = async (req, res) => {

  try {

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    if (
      appointment.userId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    appointment.status = "cancelled";

    await appointment.save();

    return res.json({
      success: true,
      message: "Appointment cancelled successfully.",
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });

  }

};
/* =====================================================
   Admin - Get All Appointments
===================================================== */

export const getAllAppointments = async (req, res) => {
  try {

    const appointments = await Appointment.find()
      .populate("propertyId", "title location")
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      appointments,
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};


/* =====================================================
   Admin - Update Appointment Status
===================================================== */

export const updateAppointmentStatus = async (req, res) => {

  try {

    const { appointmentId, status } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status },
      { new: true }
    )
      .populate("propertyId")
      .populate("userId");

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    return res.json({
      success: true,
      message: "Status updated successfully.",
      appointment,
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });

  }

};


/* =====================================================
   Dashboard Appointment Stats
===================================================== */

export const getAppointmentStats = async (req, res) => {

  try {

    const pending = await Appointment.countDocuments({
      status: "pending",
    });

    const confirmed = await Appointment.countDocuments({
      status: "confirmed",
    });

    const cancelled = await Appointment.countDocuments({
      status: "cancelled",
    });

    const completed = await Appointment.countDocuments({
      status: "completed",
    });

    return res.json({
      success: true,
      stats: {
        total:
          pending +
          confirmed +
          cancelled +
          completed,

        pending,
        confirmed,
        cancelled,
        completed,
      },
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });

  }

};


/* =====================================================
  Meeting Link
===================================================== */

export const updateAppointmentMeetingLink = async (req, res) => {
  try {
    const { appointmentId, meetingLink } = req.body;

    if (!meetingLink) {
      return res.status(400).json({
        success: false,
        message: "Meeting link is required",
      });
    }

    const appointment = await Appointment.findById(appointmentId)
      .populate("userId", "name email")
      .populate("propertyId", "title location");

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Save meeting link
    appointment.meetingLink = meetingLink;
    await appointment.save();

    // Send Email
    await sendEmail({
      to: appointment.userId.email,
      subject: "BuildEstate Property Viewing Meeting Link",
      html: `
        <h2>Hello ${appointment.userId.name},</h2>

        <p>Your property viewing appointment has been confirmed.</p>

        <h3>Property Details</h3>

        <p><b>Property:</b> ${appointment.propertyId.title}</p>

        <p><b>Location:</b> ${appointment.propertyId.location}</p>

        <p><b>Date:</b> ${new Date(
          appointment.date
        ).toLocaleDateString()}</p>

        <p><b>Time:</b> ${appointment.time}</p>

        <br>

        <p><b>Meeting Link</b></p>

        <a href="${meetingLink}">
          ${meetingLink}
        </a>

        <br><br>

        <p>Thank you,</p>

        <h3>BuildEstate Team</h3>
      `,
    });

    return res.json({
      success: true,
      message: "Meeting link saved and email sent.",
      appointment,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =====================================================
   Dummy Feedback
===================================================== */

export const submitAppointmentFeedback = async (
  req,
  res
) => {

  return res.json({
    success: true,
    message:
      "Feedback feature disabled.",
  });

};


/* =====================================================
   Upcoming Appointments
===================================================== */

export const getUpcomingAppointments = async (
  req,
  res
) => {

  try {

    const appointments = await Appointment.find({
      userId: req.user._id,
      status: {
        $in: ["pending", "confirmed"],
      },
    })
      .populate("propertyId")
      .sort({
        date: 1,
        time: 1,
      });

    return res.json({
      success: true,
      appointments,
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });

  }

};