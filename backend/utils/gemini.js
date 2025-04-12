import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

/**
 * Parse Resume using Google Gemini AI
 * @param {string} resumeText - Extracted text from the resume file
 * @returns {Object} Structured resume data
 */
// In utils/gemini.js
export const parseResume = async (resumeText) => {
  try {
    // More detailed and structured prompt
    const prompt = `
      Parse the following resume text into a well-structured JSON format.
      
      GUIDELINES:
      - Extract ALL information accurately
      - For missing information, use null or empty arrays
      - Normalize job titles to industry-standard terms where appropriate
      - Identify both explicit and implicit skills
      
      OUTPUT FORMAT (JSON only):
      {
        "full_name": "John Doe",
        "contact_information": {
          "email": "email@example.com",
          "phone": "123-456-7890",
          "location": "City, State",
          "linkedin": "linkedin profile if available"
        },
        "summary": "Professional summary text",
        "work_experience": [
          {
            "title": "Job Title",
            "company": "Company Name",
            "location": "City, State",
            "duration": "Start Date - End Date",
            "responsibilities": ["Responsibility 1", "Responsibility 2"],
            "achievements": ["Achievement 1", "Achievement 2"]
          }
        ],
        "education": [
          {
            "degree": "Degree Name",
            "field": "Field of Study",
            "institution": "Institution Name",
            "location": "City, State",
            "graduation_date": "Year",
            "gpa": "GPA if mentioned"
          }
        ],
        "skills": {
          "technical": ["Skill 1", "Skill 2"],
          "soft": ["Skill 1", "Skill 2"],
          "languages": ["Language 1", "Language 2"]
        },
        "certifications": [
          {
            "name": "Certification Name",
            "issuer": "Issuing Organization",
            "date": "Issue Date or Year",
            "expires": "Expiration Date if applicable"
          }
        ],
        "projects": [
          {
            "name": "Project Name",
            "description": "Brief description",
            "technologies": ["Tech 1", "Tech 2"],
            "url": "Project URL if available"
          }
        ]
      }
      
      RESUME TEXT:
      ${resumeText}
      
      Respond with ONLY the JSON object, no other text or formatting.
    `;

    const response = await axios.post(GEMINI_URL, {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.1,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8000,
      },
    });

    let aiResponse = response.data.candidates[0]?.content?.parts[0]?.text;
    
    if (!aiResponse) {
      throw new Error("Empty response from Gemini API");
    }

    // Clean up the response to ensure valid JSON
    aiResponse = aiResponse.replace(/```json|```/g, "").trim();

    // Handle potential JSON parsing errors
    try {
      return JSON.parse(aiResponse);
    } catch (parseError) {
      // If parsing fails, try to recover by removing non-JSON parts
      aiResponse = aiResponse.replace(/^[^{]*/, "").replace(/[^}]*$/, "");
      try {
        return JSON.parse(aiResponse);
      } catch (secondParseError) {
        console.error("JSON parsing error:", secondParseError.message);
        console.error("AI response:", aiResponse);
        throw new Error("Failed to parse AI response as JSON");
      }
    }
  } catch (error) {
    console.error("Gemini API Error:", error.response?.data || error.message);
    throw new Error("Error parsing resume with AI: " + error.message);
  }
};

/**
 * Screen a Resume for Job Match
 * @param {string} resumeText - Parsed resume text
 * @param {string} jobDescription - The job description
 * @returns {Object} AI-generated match score & feedback
 */
// In utils/gemini.js
export const screenResume = async (resumeText, jobDescription) => {
  try {
    const prompt = `
      You are an expert ATS (Applicant Tracking System) AI designed to evaluate resumes against job descriptions.
      
      Task: Analyze the provided resume against the job description and create a comprehensive assessment.
      
      ASSESSMENT CRITERIA:
      1. Skills match (required vs nice-to-have vs missing)
      2. Experience relevance and years
      3. Education requirements
      4. Industry knowledge
      5. Cultural/soft skills fit
      6. Keyword optimization
      
      OUTPUT FORMAT (JSON only):
      {
        "match_score": 85, // Overall percentage match
        "skills_match": [
          {
            "skill": "JavaScript", 
            "importance": "high/medium/low", 
            "match": true/false,
            "confidence": "high/medium/low"
          }
        ],
        "experience_match": [
          {
            "requirement": "5+ years in web development", 
            "matched": true/false, 
            "comments": "Detailed comparison with resume"
          }
        ],
        "education_match": [
          {
            "requirement": "Bachelor's degree requirement", 
            "matched": true/false,
            "comments": "Details from resume"
          }
        ],
        "keyword_analysis": {
          "job_keywords": ["keyword1", "keyword2"],
          "resume_keywords": ["keyword1", "keyword3"],
          "missing_keywords": ["keyword2"],
          "keyword_match_percentage": 85
        },
        "strengths": [
          "Detailed strength point 1",
          "Detailed strength point 2"
        ],
        "gaps": [
          "Detailed gap 1",
          "Detailed gap 2"
        ],
        "recommendations": [
          "Specific recommendation 1",
          "Specific recommendation 2"
        ],
        "interview_questions": [
          "Suggested question to probe gap areas",
          "Technical validation question"
        ],
        "summary": "Detailed 2-3 sentence assessment summary"
      }
      
      RESUME TEXT:
      ${resumeText}
      
      JOB DESCRIPTION:
      ${jobDescription}
      
      Respond with ONLY the JSON object. No introduction, no explanation, no markdown.
    `;

    const response = await axios.post(GEMINI_URL, {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.2,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8000,
      },
    });

    let aiResponse = response.data.candidates[0]?.content?.parts[0]?.text;
    
    if (!aiResponse) {
      throw new Error("Empty response from Gemini API");
    }

    // Clean up the response to ensure valid JSON
    aiResponse = aiResponse.replace(/```json|```/g, "").trim();

    // Handle potential JSON parsing errors with fallback
    try {
      return JSON.parse(aiResponse);
    } catch (parseError) {
      // Try to recover malformed JSON
      aiResponse = aiResponse.replace(/^[^{]*/, "").replace(/[^}]*$/, "");
      try {
        return JSON.parse(aiResponse);
      } catch (secondParseError) {
        console.error("JSON parsing error:", secondParseError.message);
        console.error("AI response:", aiResponse);
        throw new Error("Failed to parse AI response as JSON");
      }
    }
  } catch (error) {
    console.error("Gemini API Error:", error.response?.data || error.message);
    throw new Error("Error screening resume with AI: " + error.message);
  }
};
