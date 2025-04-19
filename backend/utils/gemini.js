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
      - Distinguish between technical and soft skills
      - Extract project details and accomplishments wherever possible
      - Calculate total years of experience
      
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
            "duration_months": 24, 
            "responsibilities": ["Responsibility 1", "Responsibility 2"],
            "achievements": ["Achievement 1", "Achievement 2"],
            "technologies_used": ["Tech 1", "Tech 2"]
          }
        ],
        "total_experience_years": 5,
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
          "languages": ["Language 1", "Language 2"],
          "tools": ["Tool 1", "Tool 2"]
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
            "url": "Project URL if available",
            "achievements": ["Achievement 1"]
          }
        ],
        "career_progression": {
          "trajectory": "Ascending/Stable/Varied",
          "job_changes": 3,
          "average_tenure_months": 24
        }
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
 * Screen a Resume for Job Match - Enhanced version with more detailed analysis
 * @param {string} resumeText - Parsed resume text
 * @param {string} jobDescription - The job description
 * @returns {Object} AI-generated match score & comprehensive feedback
 */
export const screenResume = async (resumeText, jobDescription) => {
  try {
    const prompt = `
      You are an expert ATS (Applicant Tracking System) AI designed to evaluate resumes against job descriptions.
      
      Task: Analyze the provided resume against the job description and create a comprehensive assessment with actionable insights.
      
      ASSESSMENT CRITERIA:
      1. Skills match (required vs nice-to-have vs missing)
      2. Experience relevance and years
      3. Education requirements
      4. Industry knowledge
      5. Cultural/soft skills fit
      6. Keyword optimization
      7. Career trajectory alignment
      8. Growth potential
      9. Leadership capabilities
      10. Communication style evidence
      
      OUTPUT FORMAT (JSON only):
      {
        "match_score": 85, // Overall percentage match
        "skills_match": [
          {
            "skill": "JavaScript", 
            "importance": "high/medium/low", 
            "match": true/false,
            "confidence": "high/medium/low",
            "evidence": "Brief evidence from resume",
            "proficiency_level": "beginner/intermediate/expert/undetermined"
          }
        ],
        "experience_match": [
          {
            "requirement": "5+ years in web development", 
            "matched": true/false, 
            "years_difference": 1, // Positive means exceeds, negative means under requirement
            "comments": "Detailed comparison with resume",
            "relevance_score": 90 // How relevant the experience is to the role
          }
        ],
        "education_match": [
          {
            "requirement": "Bachelor's degree requirement", 
            "matched": true/false,
            "comments": "Details from resume",
            "relevance_of_field": "high/medium/low"
          }
        ],
        
        "career_alignment": {
          "score": 80,
          "analysis": "Detailed analysis of career trajectory vs job requirements",
          "potentialGrowth": ["Area 1", "Area 2"]
        },
        "candidate_type": "Specialist/Generalist/Leader/Innovator/Executor",
        "strengths": [
          "Detailed strength point 1",
          "Detailed strength point 2"
        ],
        "gaps": [
          "Detailed gap 1",
          "Detailed gap 2"
        ],
        "development_areas": [
          {
            "area": "Specific skill or capability",
            "importance": "high/medium/low",
            "development_suggestion": "Specific actionable suggestion"
          }
        ],
        "recommendations": {
  "recruiter_insights": [
    "Recommendation on whether to proceed to interview (e.g., strong match, moderate match, not a fit)",
    "Suggestions on areas to probe further during the interview",
    "Comments on candidate's team fit, leadership potential, or ramp-up needs"
  ],
  "candidate_improvement_suggestions": [
    "Specific suggestion to improve resume presentation or content",
    "Skills or certifications that could enhance job fit in the future"
  ]
},

        "interview_questions": [
          {
            "question": "Suggested question to probe gap areas",
            "purpose": "What this question aims to reveal",
            "expected_answer_elements": ["Element 1", "Element 2"]
          }
        ],
        "summary": "Detailed 3-4 sentence assessment summary including key strengths, gaps, and ultimate recommendation"
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
