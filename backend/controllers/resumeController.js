import pdfParse from "pdf-parse";
import { parseResume, screenResume } from "../utils/gemini.js";

/**
 * Resume Upload Handler
 * Extracts text from the uploaded PDF and sends it to AI for parsing.
 */
// In resumeController.js
export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }
    
    // Add file type validation
    if (!req.file.mimetype || !req.file.mimetype.includes('pdf')) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid file format. Please upload PDF files only." 
      });
    }

    // Check file size (limit to 5MB for example)
    if (req.file.size > 5 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        message: "File too large. Maximum size is 5MB."
      });
    }

    // Extract text from PDF
    const pdfBuffer = req.file.buffer;
    try {
      const parsedPDF = await pdfParse(pdfBuffer);
      const extractedText = parsedPDF.text.trim();
      
      if (!extractedText || extractedText.length < 100) {
        return res.status(400).json({
          success: false,
          message: "Could not extract sufficient text from PDF. The file may be scanned or protected."
        });
      }

      // Send to AI for structured parsing
      const structuredResume = await parseResume(extractedText);

      res.json({
        success: true,
        extractedText,
        structuredResume,
      });
    } catch (pdfError) {
      console.error("PDF parsing error:", pdfError);
      return res.status(400).json({
        success: false,
        message: "Failed to parse PDF. Please check if the file is valid."
      });
    }
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ success: false, message: "Server error while processing resume" });
  }
};

/**
 * Resume Screening Handler
 * Compares the resume with a job description using AI.
 */
export const screenJobApplication = async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;
    if (!resumeText || !jobDescription) {
      return res.status(400).json({
        success: false,
        message: "Resume text and job description required",
      });
    }

    const screeningResult = await screenResume(resumeText, jobDescription);

    res.json({
      success: true,
      matchScore: screeningResult.match_score || 0,
      matchDetails: {
        skillsMatch: screeningResult.skills_match || [],
        experienceMatch: screeningResult.experience_match || [],
        educationMatch: screeningResult.education_match || [],
      },
      strengths: screeningResult.strengths || [],
      weaknesses: screeningResult.gaps || [],
      recommendations: screeningResult.recommendations || [],
      summary: screeningResult.summary || "",
    });
  } catch (error) {
    console.error("Screening error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

