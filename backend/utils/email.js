import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE, // e.g., 'gmail'
  auth: {
    user: process.env.EMAIL_USERNAME, // Your email address
    pass: process.env.EMAIL_PASSWORD, // App-specific password
  },
});

export const sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USERNAME,
      to,
      subject,
      text,
    });
    console.log("Email sent successfully to", to);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

// New function to generate status update emails
export const generateStatusEmail = (
  applicantName,
  jobTitle,
  companyName,
  status
) => {
  // Customize messages based on application status
  const statusMessages = {
    accepted: {
      subject: `Congratulations on Your ${jobTitle} Application!`,
      statusLine: `We're thrilled to inform you that your application has been ACCEPTED.`,
      nextSteps: `Our team will be reaching out shortly to discuss next steps, including compensation details and a potential start date. Please keep an eye on your inbox for a calendar invitation to connect.`,
    },
    "in review": {
      subject: `Your ${jobTitle} Application is Under Review`,
      statusLine: `Your application is currently IN REVIEW by our hiring team.`,
      nextSteps: `We're carefully evaluating all candidates and expect to make decisions within the next 1-2 weeks. We appreciate your patience during this process.`,
    },
    interview: {
      subject: `Interview Request: ${jobTitle} Position`,
      statusLine: `We'd like to invite you to interview for this position!`,
      nextSteps: `Please visit our candidate portal to select an interview time that works best for your schedule. We're looking forward to learning more about your experience and how you might contribute to our team.`,
    },
    rejected: {
      subject: `Update on Your ${companyName} Application`,
      statusLine: `After careful consideration, we've decided to move forward with other candidates at this time.`,
      nextSteps: `We encourage you to apply for future positions that match your qualifications. We've kept your profile in our talent database and will reach out if we find a better fit.`,
    },
    default: {
      subject: `Update on Your ${jobTitle} Application`,
      statusLine: `Your application status has been updated to: ${status.toUpperCase()}.`,
      nextSteps: `Please log into our candidate portal for more details about next steps in our process.`,
    },
  };

  // Select the appropriate message template or use default
  const messageTemplate =
    statusMessages[status.toLowerCase()] || statusMessages.default;

  // Build the email body
  const emailBody = `
Dear ${applicantName},

Thank you for applying to the ${jobTitle} position at ${companyName}. ${
    messageTemplate.statusLine
  }

${messageTemplate.nextSteps}

If you have any questions about your application or our hiring process, please contact us at careers@${companyName
    .toLowerCase()
    .replace(/\s+/g, "")}.com or reply directly to this email.

We value your interest in joining our team and appreciate the time you've invested in your application.

Best regards,

Talent Acquisition Manager
${companyName}
  `;

  return {
    subject: messageTemplate.subject,
    body: emailBody.trim(),
  };
};
