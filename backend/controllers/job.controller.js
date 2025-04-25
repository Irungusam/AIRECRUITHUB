import { Job } from "../models/job.model.js";

// admin post krega job
export const postJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experience,
      position,
      companyId,
      companyName,
    } = req.body;
    const userId = req.id;

    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      !location ||
      !jobType ||
      !experience ||
      !position ||
      !companyId
    ) {
      return res.status(400).json({
        message: "Somethin is missing.",
        success: false,
      });
    }
    const job = await Job.create({
      title,
      description,
      requirements: requirements.split(","),
      salary: Number(salary),
      location,
      jobType,
      experienceLevel: experience,
      position,
      company: companyId,
      created_by: userId,
    });
    return res.status(201).json({
      message: "New job created successfully.",
      job,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const selectedFilters = req.query.filters
      ? req.query.filters.split(",")
      : [];

    const query = {
      $and: [
        {
          $or: [
            { title: { $regex: keyword, $options: "i" } },
            { description: { $regex: keyword, $options: "i" } },
          ],
        },
        ...(selectedFilters.length > 0
          ? [
              {
                $or: selectedFilters.map((filter) => ({
                  $or: [
                    { location: { $regex: filter, $options: "i" } },
                    { jobType: { $regex: filter, $options: "i" } },
                    { salary: { $regex: filter, $options: "i" } },
                    { requirements: { $regex: filter, $options: "i" } },
                  ],
                })),
              },
            ]
          : []),
      ],
    };

    const jobs = await Job.find(query)
      .populate({
        path: "company",
        select: "name logo location website description",
      })
      .sort({ createdAt: -1 });

    if (!jobs.length) {
      return res.status(404).json({
        message: "No jobs found matching the criteria.",
        success: false,
      });
    }

    return res.status(200).json({ jobs, success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

// Add this function to job.controller.js

export const updateJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.id;
    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experience,
      position,
      companyId,
    } = req.body;

    // Find the job first to verify it exists and belongs to this admin
    const existingJob = await Job.findOne({ 
      _id: jobId,
      created_by: userId 
    });

    if (!existingJob) {
      return res.status(404).json({
        message: "Job not found or you don't have permission to edit it.",
        success: false,
      });
    }

    // Process requirements - handle both string and array formats
    let processedRequirements = requirements;
    if (typeof requirements === 'string') {
      processedRequirements = requirements.split(',');
    }

    // Update the job with new values
    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      {
        title,
        description,
        requirements: processedRequirements,
        salary: Number(salary),
        location,
        jobType,
        experienceLevel: experience,
        position,
        company: companyId,
      },
      { new: true, runValidators: true }
    ).populate({
      path: "company",
      select: "name logo location website description",
    });

    return res.status(200).json({
      message: "Job updated successfully.",
      job: updatedJob,
      success: true,
    });
  } catch (error) {
    console.error("Error updating job:", error);
    return res.status(500).json({
      message: "An error occurred while updating the job.",
      success: false,
    });
  }
};

// Job Seeker
export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId)
      .populate({
        path: "company",
        select: "name logo location website description",
      })
      .populate({ path: "applications" });
    if (!job) {
      return res.status(404).json({
        message: "Jobs not found.",
        success: false,
      });
    }
    return res.status(200).json({ job, success: true });
  } catch (error) {
    console.log(error);
  }
};

export const getAdminJobs = async (req, res) => {
  try {
    const adminId = req.id;
    const jobs = await Job.find({ created_by: adminId }).populate({
      path: "company",
      createdAt: -1,
    });
    if (!jobs) {
      return res.status(404).json({
        message: "Jobs not found.",
        success: false,
      });
    }
    return res.status(200).json({
      jobs,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const deleteJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.id;

    // Find the job first to verify it exists and belongs to this admin
    const existingJob = await Job.findOne({
      _id: jobId,
      created_by: userId,
    });

    if (!existingJob) {
      return res.status(404).json({
        message: "Job not found or you don't have permission to delete it.",
        success: false,
      });
    }

    // Delete the job
    await Job.findByIdAndDelete(jobId);

    return res.status(200).json({
      message: "Job deleted successfully.",
      success: true,
    });
  } catch (error) {
    console.error("Error deleting job:", error);
    return res.status(500).json({
      message: "An error occurred while deleting the job.",
      success: false,
    });
  }
};
