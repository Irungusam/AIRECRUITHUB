import { Company } from "../models/company.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { Job } from "../models/job.model.js";

export const registerCompany = async (req, res) => {
    try {
        const { companyName } = req.body;
        if (!companyName) {
            return res.status(400).json({
                message: "Company name is required.",
                success: false
            });
        }
        let company = await Company.findOne({ name: companyName });
        if (company) {
            return res.status(400).json({
                message: "You can't register same company.",
                success: false
            })
        };
        company = await Company.create({
            name: companyName,
            userId: req.id
        });

        return res.status(201).json({
            message: "Company registered successfully.",
            company,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export const getCompany = async (req, res) => {
    try {
        const userId = req.id; // logged in user id
        const companies = await Company.find({ userId });
        if (!companies) {
            return res.status(404).json({
                message: "Companies not found.",
                success: false
            })
        }
        return res.status(200).json({
            companies,
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}
// get company by id
export const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            })
        }
        return res.status(200).json({
            company,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export const updateCompany = async (req, res) => {
    try {
        const { name, description, website, location } = req.body;
 
        const file = req.file;
        // idhar cloudinary ayega
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
        const logo = cloudResponse.secure_url;
    
        const updateData = { name, description, website, location, logo };

        const company = await Company.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            })
        }
        return res.status(200).json({
            message:"Company information updated.",
            success:true
        })

    } catch (error) {
        console.log(error);
    }
}

export const deleteCompany = async (req, res) => {
  try {
    const companyId = req.params.id;
    const userId = req.id;

    // Find the company first to verify it exists and belongs to this admin
    const company = await Company.findOne({
      _id: companyId,
      userId: userId,
    });

    if (!company) {
      return res.status(404).json({
        message: "Company not found or you don't have permission to delete it.",
        success: false,
      });
    }

    // Check if there are any jobs associated with this company
    const jobsWithCompany = await Job.find({ company: companyId });
    if (jobsWithCompany.length > 0) {
      // Option 1: Delete all jobs associated with this company
      await Job.deleteMany({ company: companyId });

      // Option 2: Return error and ask user to delete jobs first
      /* return res.status(400).json({
        message: "Cannot delete company with associated jobs. Please delete all jobs first.",
        success: false,
      }); */
    }

    // Delete the company and its logo from cloudinary if applicable
    if (company.logo && company.logo.includes("cloudinary")) {
      try {
        // Extract public_id from the URL
        const publicId = company.logo.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (cloudinaryError) {
        console.error("Error deleting logo from cloudinary:", cloudinaryError);
        // Continue with company deletion even if logo deletion fails
      }
    }

    await Company.findByIdAndDelete(companyId);

    return res.status(200).json({
      message: "Company deleted successfully.",
      success: true,
    });
  } catch (error) {
    console.error("Error deleting company:", error);
    return res.status(500).json({
      message: "An error occurred while deleting the company.",
      success: false,
    });
  }
};