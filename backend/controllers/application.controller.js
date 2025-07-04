import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import { sendEmail, generateStatusEmail } from "../utils/email.js";

export const applyJob = async (req, res) => {
  try {
    const userId = req.id;
    const jobId = req.params.id;
    if (!jobId) {
      return res.status(400).json({
        message: "Job id is required.",
        success: false,
      });
    }
    // check if the user has already applied for the job
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: userId,
    });

    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this jobs",
        success: false,
      });
    }

    // check if the jobs exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }
    // create a new application
    const newApplication = await Application.create({
      job: jobId,
      applicant: userId,
    });

    job.applications.push(newApplication._id);
    await job.save();
    return res.status(201).json({
      message: "Job applied successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.id;
    const application = await Application.find({ applicant: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "job",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "company",
          options: { sort: { createdAt: -1 } },
        },
      });
    if (!application) {
      return res.status(404).json({
        message: "No Applications",
        success: false,
      });
    }
    return res.status(200).json({
      application,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// admin dekhega kitna user ne apply kiya hai
export const getApplicants = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate({
      path: "applications",
      options: { sort: { createdAt: -1 } },
      populate: {
        path: "applicant",
      },
    });
    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        success: false,
      });
    }
    return res.status(200).json({
      job,
      succees: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;

    if (!status) {
      return res.status(400).json({
        message: "Status is required.",
        success: false,
      });
    }

    // Find the application and populate applicant, job, and company details
    const application = await Application.findById(applicationId)
      .populate("applicant", "fullname email") // Populate applicant name and email
      .populate({
        path: "job",
        select: "title",
        populate: {
          path: "company",
          select: "name", // Populate company name
        },
      });

    if (!application) {
      return res.status(404).json({
        message: "Application not found.",
        success: false,
      });
    }

    // Update the status
    application.status = status.toLowerCase();
    await application.save();

    // Extract details for the email
    const applicantEmail = application.applicant.email;
    const applicantName = application.applicant.fullname;
    const jobTitle = application.job.title;
    const companyName = application.job.company.name;

    // Generate improved email using the new function
    const emailContent = generateStatusEmail(
      applicantName,
      jobTitle,
      companyName,
      status
    );

    // Send the email with improved content
    await sendEmail(applicantEmail, emailContent.subject, emailContent.body);

    return res.status(200).json({
      message: "Status updated and email sent successfully.",
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred.",
      success: false,
    });
  }
};
