const transporter = null;

export const sendEmail = async () => {
  console.log("Email service disabled.");
  return true;
};

export const checkEmailHealth = async () => {
  return {
    status: "disabled",
    message: "Email service is disabled."
  };
};

export default transporter;