import React, { useState } from "react";
import Navbar from "../shared/Navbar";

const ResumeScreening = () => {
  const [file, setFile] = useState(null);
  const [parsedResume, setParsedResume] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [screeningResults, setScreeningResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [activeStep, setActiveStep] = useState("upload"); // upload, parse, screen
  const [showFullResume, setShowFullResume] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      // Validate file type
      if (!selectedFile.type.includes("pdf")) {
        setErrorMessage("Please upload a PDF file only");
        setFile(null);
        return;
      }

      // Validate file size (5MB max)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setErrorMessage("File size exceeds 5MB limit");
        setFile(null);
        return;
      }

      setFile(selectedFile);
      setErrorMessage("");
      setParsedResume(null);
      setScreeningResults(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return setErrorMessage("Please upload a resume");

    setLoading(true);
    setErrorMessage("");

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const response = await fetch(
        "http://localhost:8000/api/v1/resume/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      if (data.success) {
        setExtractedText(data.extractedText);
        setParsedResume(data.structuredResume);
        setActiveStep("parse");
      } else {
        setErrorMessage(`Upload failed: ${data.message}`);
      }
    } catch (error) {
      console.error("Error parsing resume:", error);
      setErrorMessage("Server error while processing resume");
    } finally {
      setLoading(false);
    }
  };

  const handleScreening = async () => {
    if (!extractedText || !jobDescription.trim()) {
      return setErrorMessage("Resume text and job description are required");
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(
        "http://localhost:8000/api/v1/resume/screen",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resumeText: extractedText, jobDescription }),
        }
      );

      const data = await response.json();
      if (data.success) {
        setScreeningResults(data);
        setActiveStep("screen");
      } else {
        setErrorMessage(`Screening failed: ${data.message}`);
      }
    } catch (error) {
      console.error("Error screening resume:", error);
      setErrorMessage("Server error while screening resume");
    } finally {
      setLoading(false);
    }
  };

  // Enhanced match score rendering
  const renderMatchScore = (score) => {
    let color = "text-red-500 dark:text-red-400";
    let description = "Poor Match";
    let suggestions =
      "Significant gaps exist. Consider major improvements or alternative candidates.";

    if (score >= 80) {
      color = "text-green-600 dark:text-green-400";
      description = "Excellent Match";
      suggestions =
        "Highly qualified candidate. Strongly recommend for next interview round.";
    } else if (score >= 70) {
      color = "text-green-500 dark:text-green-400";
      description = "Good Match";
      suggestions =
        "Good fit with some minor gaps. Worth considering for interview.";
    } else if (score >= 60) {
      color = "text-yellow-500 dark:text-yellow-400";
      description = "Average Match";
      suggestions = "Moderate fit. Review gaps carefully before proceeding.";
    } else if (score >= 50) {
      color = "text-orange-500 dark:text-orange-400";
      description = "Below Average";
      suggestions =
        "Significant gaps exist. Consider only if other factors compensate.";
    }

    return (
      <div>
        <div className="flex items-center gap-2">
          <div className={`text-3xl font-bold ${color}`}>{score}%</div>
          <div className={`${color} text-sm font-medium`}>{description}</div>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-xs">
          {suggestions}
        </div>
      </div>
    );
  };

  // Progress indicator
  const renderProgressSteps = () => {
    const steps = [
      { id: "upload", label: "Upload Resume" },
      { id: "parse", label: "Parse & Fill Job Details" },
      { id: "screen", label: "View Results" },
    ];

    return (
      <div className="flex items-center mb-8">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div
              className={`flex flex-col items-center ${
                activeStep === step.id
                  ? "text-blue-600 dark:text-blue-400"
                  : steps.indexOf({ id: activeStep }) > index
                  ? "text-green-600 dark:text-green-400"
                  : "text-gray-400 dark:text-gray-500"
              }`}
            >
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full mb-1 ${
                  activeStep === step.id
                    ? "bg-blue-100 dark:bg-blue-900 border-2 border-blue-600 dark:border-blue-400"
                    : steps.indexOf({ id: activeStep }) > index
                    ? "bg-green-100 dark:bg-green-900 border-2 border-green-600 dark:border-green-400"
                    : "bg-gray-200 dark:bg-gray-700"
                }`}
              >
                {index + 1}
              </div>
              <div className="text-xs font-medium">{step.label}</div>
            </div>
            {index < steps.length - 1 && (
              <div className="w-12 h-0.5 mx-1 bg-gray-300 dark:bg-gray-600"></div>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />
      <div className="max-w-7xl mx-auto mt-5 px-4 pb-10">
        <h2 className="text-2xl font-bold mb-6 dark:text-white">
          AI-Powered Resume Screening
        </h2>

        {renderProgressSteps()}

        {/* Error Messages */}
        {errorMessage && (
          <div className="my-3 p-3 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-200 rounded">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 inline mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {errorMessage}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="border rounded-lg p-5 bg-white dark:bg-gray-800 shadow-sm dark:border-gray-700">
            {/* Upload Panel */}
            <div className={activeStep !== "upload" ? "hidden" : ""}>
              <h3 className="text-lg font-semibold mb-4 dark:text-white">
                Upload Resume
              </h3>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 flex flex-col items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-gray-400 mb-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>

                <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-md transition">
                  Choose PDF Resume
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf"
                  />
                </label>

                {file && (
                  <div className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                    Selected: <span className="font-medium">{file.name}</span>
                  </div>
                )}

                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Maximum file size: 5MB (PDF only)
                </p>
              </div>

              <button
                onClick={handleUpload}
                className={`mt-4 w-full py-2 px-4 rounded-md ${
                  loading || !file
                    ? "bg-gray-300 dark:bg-gray-600 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white"
                }`}
                disabled={loading || !file}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  "Upload & Parse Resume"
                )}
              </button>
            </div>

            {/* Parsed Resume & Job Description Panel */}
            <div className={activeStep !== "parse" ? "hidden" : ""}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold dark:text-white">
                  Parsed Resume
                </h3>
                <button
                  onClick={() => setShowFullResume(!showFullResume)}
                  className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  {showFullResume ? "Show Summary" : "Show Full Details"}
                </button>
              </div>

              {parsedResume && (
                <div className="mb-6 p-4 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 max-h-80 overflow-y-auto">
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-gray-700 dark:text-gray-300">
                        Basic Information
                      </h4>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {parsedResume.full_name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {parsedResume.contact_information?.email} |{" "}
                        {parsedResume.contact_information?.phone}
                      </p>
                      {parsedResume.contact_information?.location && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {parsedResume.contact_information.location}
                        </p>
                      )}
                    </div>

                    {showFullResume ? (
                      <>
                        {/* Summary */}
                        {parsedResume.summary && (
                          <div>
                            <h4 className="font-medium text-gray-700 dark:text-gray-300">
                              Summary
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {parsedResume.summary}
                            </p>
                          </div>
                        )}

                        {/* Work Experience */}
                        {parsedResume.work_experience &&
                          parsedResume.work_experience.length > 0 && (
                            <div>
                              <h4 className="font-medium text-gray-700 dark:text-gray-300">
                                Work Experience
                              </h4>
                              {parsedResume.work_experience.map((exp, i) => (
                                <div key={i} className="mb-2">
                                  <p className="text-gray-900 dark:text-white font-medium">
                                    {exp.title} at {exp.company}
                                  </p>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {exp.duration}
                                  </p>
                                  <ul className="list-disc text-sm text-gray-600 dark:text-gray-400 pl-5 mt-1">
                                    {exp.responsibilities
                                      ?.slice(0, 2)
                                      .map((resp, j) => (
                                        <li key={j}>{resp}</li>
                                      ))}
                                    {exp.responsibilities?.length > 2 && (
                                      <li>...</li>
                                    )}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          )}

                        {/* Education */}
                        {parsedResume.education &&
                          parsedResume.education.length > 0 && (
                            <div>
                              <h4 className="font-medium text-gray-700 dark:text-gray-300">
                                Education
                              </h4>
                              {parsedResume.education.map((edu, i) => (
                                <div key={i} className="mb-1">
                                  <p className="text-gray-900 dark:text-white">
                                    {edu.degree} in {edu.field}
                                  </p>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {edu.institution}, {edu.graduation_date}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}
                      </>
                    ) : null}

                    {/* Skills */}
                    <div>
                      <h4 className="font-medium text-gray-700 dark:text-gray-300">
                        Skills
                      </h4>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {/* Handle both array and object structure for skills */}
                        {Array.isArray(parsedResume.skills) ? (
                          parsedResume.skills?.map((skill, i) => (
                            <span
                              key={i}
                              className="bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded text-xs"
                            >
                              {skill}
                            </span>
                          ))
                        ) : (
                          <>
                            {parsedResume.skills?.technical?.map((skill, i) => (
                              <span
                                key={`tech-${i}`}
                                className="bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded text-xs"
                              >
                                {skill}
                              </span>
                            ))}
                            {parsedResume.skills?.soft?.map((skill, i) => (
                              <span
                                key={`soft-${i}`}
                                className="bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-200 px-2 py-1 rounded text-xs"
                              >
                                {skill}
                              </span>
                            ))}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <h3 className="text-lg font-semibold mt-6 mb-3 dark:text-white">
                Job Description
              </h3>
              <textarea
                className="w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={12}
                placeholder="Paste the job description here..."
              />

              <div className="flex justify-between mt-4">
                <button
                  onClick={() => setActiveStep("upload")}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Back to Upload
                </button>

                <button
                  onClick={handleScreening}
                  className={`px-4 py-2 rounded-md ${
                    loading || !jobDescription.trim()
                      ? "bg-gray-300 dark:bg-gray-600 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white"
                  }`}
                  disabled={loading || !jobDescription.trim()}
                >
                  {loading ? "Analyzing..." : "Match Resume to Job"}
                </button>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="border rounded-lg p-5 bg-white dark:bg-gray-800 shadow-sm dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">
              Screening Results
            </h3>

            {!screeningResults ? (
              <div className="flex flex-col items-center justify-center h-64 text-center text-gray-500 dark:text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  />
                </svg>
                <p className="mb-1">No results yet</p>
                <p className="text-sm">
                  Upload a resume and job description to see matching results
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Quick Assessment Card */}
                <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                  <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                    Quick Assessment
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-blue-600 dark:text-blue-300">
                        Top Strength
                      </p>
                      <p className="text-sm font-medium dark:text-white">
                        {screeningResults.strengths?.[0]?.split(":")?.[0] ||
                          "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-blue-600 dark:text-blue-300">
                        Critical Gap
                      </p>
                      <p className="text-sm font-medium dark:text-white">
                        {screeningResults.weaknesses?.[0]?.split(":")?.[0] ||
                          "None"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-blue-600 dark:text-blue-300">
                        Key Skill
                      </p>
                      <p className="text-sm font-medium dark:text-white">
                        {screeningResults.matchDetails?.skillsMatch?.find(
                          (s) => s.importance === "high" && s.match
                        )?.skill || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-blue-600 dark:text-blue-300">
                        Recommendation
                      </p>
                      <p className="text-sm font-medium dark:text-white">
                        {screeningResults.matchScore >= 70
                          ? "Interview"
                          : screeningResults.matchScore >= 50
                          ? "Consider"
                          : "Reject"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Match Score - Enhanced */}
                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border dark:border-gray-600">
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Comprehensive Match Analysis
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h5 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Overall Match
                      </h5>
                      {renderMatchScore(screeningResults.matchScore)}
                    </div>

                    <div>
                      <h5 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Career Alignment
                      </h5>
                      <div className="flex items-center gap-2">
                        <div className="text-2xl font-bold">
                          {screeningResults.careerAlignment?.score || 0}%
                        </div>
                        {screeningResults.candidateType ? (
                          <span className="text-xs bg-blue-100 text-blue-600 dark:bg-blue-600/10 dark:text-blue-300 px-2 py-0.5 rounded-full font-medium">
                            {screeningResults.candidateType}
                          </span>
                        ) : (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Not specified
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border dark:border-gray-600">
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Summary
                  </h4>
                  <p className="text-gray-800 dark:text-gray-200">
                    {screeningResults.summary}
                  </p>
                </div>

                {/* Strengths */}
                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border dark:border-gray-600">
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Key Strengths
                  </h4>
                  <ul className="space-y-1">
                    {screeningResults.strengths?.map((strength, i) => (
                      <li key={i} className="flex items-start">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="dark:text-gray-300">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Gaps/Weaknesses */}
                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border dark:border-gray-600">
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Areas for Improvement
                  </h4>
                  <ul className="space-y-1">
                    {screeningResults.weaknesses?.map((weakness, i) => (
                      <li key={i} className="flex items-start">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="dark:text-gray-300">{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Skills Match - Enhanced */}
                {screeningResults.matchDetails?.skillsMatch?.length > 0 && (
                  <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border dark:border-gray-600">
                    <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Skills Analysis
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="text-sm font-medium text-indigo-500 dark:text-pink-400 mb-2">
                          Matched Skills
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {screeningResults.matchDetails.skillsMatch
                            .filter((skill) => skill.match)
                            .map((skill, i) => (
                              <div key={i} className="relative group">
                                <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-3 py-1 rounded-full text-xs flex items-center">
                                  {skill.skill}
                                  <span className="ml-1 text-xs opacity-70">
                                    ({skill.importance})
                                  </span>
                                </span>
                                {skill.evidence && (
                                  <div className="absolute z-10 hidden group-hover:block bg-white dark:bg-gray-800 p-2 rounded shadow-lg border dark:border-gray-600 text-xs w-64">
                                    {skill.evidence}
                                  </div>
                                )}
                              </div>
                            ))}
                        </div>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                          Missing Skills
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {screeningResults.matchDetails.skillsMatch
                            .filter(
                              (skill) =>
                                !skill.match && skill.importance === "high"
                            )
                            .map((skill, i) => (
                              <span
                                key={i}
                                className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 px-3 py-1 rounded-full text-xs"
                              >
                                {skill.skill}
                              </span>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Detailed Skills Table */}
                {screeningResults.matchDetails?.skillsMatch?.length > 0 && (
                  <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border dark:border-gray-600">
                    <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Detailed Skills Analysis
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm">
                        <thead className="bg-gray-100 dark:bg-gray-600">
                          <tr>
                            <th className="p-2 text-left dark:text-gray-300">
                              Skill
                            </th>
                            <th className="p-2 text-left dark:text-gray-300">
                              Importance
                            </th>
                            <th className="p-2 text-left dark:text-gray-300">
                              Match
                            </th>
                            <th className="p-2 text-left dark:text-gray-300">
                              Proficiency
                            </th>
                            <th className="p-2 text-left dark:text-gray-300">
                              Evidence
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {screeningResults.matchDetails.skillsMatch
                            .sort((a, b) => {
                              const importanceOrder = {
                                high: 3,
                                medium: 2,
                                low: 1,
                              };
                              return (
                                importanceOrder[b.importance] -
                                  importanceOrder[a.importance] ||
                                (b.match ? 1 : -1)
                              );
                            })
                            .map((skill, i) => (
                              <tr
                                key={i}
                                className="border-t dark:border-gray-600"
                              >
                                <td className="p-2 dark:text-gray-300 font-medium">
                                  {skill.skill}
                                </td>
                                <td className="p-2">
                                  <span
                                    className={`inline-block px-2 py-1 rounded-full text-xs ${
                                      skill.importance === "high"
                                        ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                        : skill.importance === "medium"
                                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                        : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                    }`}
                                  >
                                    {skill.importance}
                                  </span>
                                </td>
                                <td className="p-2">
                                  {skill.match ? (
                                    <span className="text-green-500 flex items-center">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 mr-1"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                      Present
                                    </span>
                                  ) : (
                                    <span className="text-red-500 flex items-center">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 mr-1"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                      Missing
                                    </span>
                                  )}
                                </td>
                                <td className="p-2">
                                  <span
                                    className={`text-xs px-2 py-1 rounded-full ${
                                      skill.proficiency_level === "expert"
                                        ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                                        : skill.proficiency_level ===
                                          "intermediate"
                                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                        : "bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200"
                                    }`}
                                  >
                                    {skill.proficiency_level || "Unknown"}
                                  </span>
                                </td>
                                <td className="p-2 text-xs text-gray-600 dark:text-gray-400 max-w-xs truncate">
                                  {skill.evidence || "Not specified"}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Experience Match - Enhanced */}
                {screeningResults.matchDetails?.experienceMatch?.length > 0 && (
                  <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border dark:border-gray-600">
                    <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Experience Analysis
                    </h4>
                    <div className="space-y-3">
                      {screeningResults.matchDetails.experienceMatch.map(
                        (exp, i) => (
                          <div key={i} className="flex items-start">
                            {exp.matched ? (
                              <svg
                                className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            ) : (
                              <svg
                                className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                            <div>
                              <p className="text-sm font-medium dark:text-gray-200">
                                {exp.requirement}
                              </p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                {exp.comments || "No additional comments"}
                                {exp.years_difference !== undefined && (
                                  <span
                                    className={`ml-2 ${
                                      exp.years_difference >= 0
                                        ? "text-green-600 dark:text-green-400"
                                        : "text-red-600 dark:text-red-400"
                                    }`}
                                  >
                                    ({exp.years_difference >= 0 ? "+" : ""}
                                    {exp.years_difference} years)
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border dark:border-gray-600">
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Recommendations
                  </h4>

                  {screeningResults.recommendations?.recruiter_insights
                    ?.length > 0 && (
                    <div className="mb-4">
                      <h5 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
                        For Recruiter
                      </h5>
                      <ul className="space-y-1">
                        {screeningResults.recommendations.recruiter_insights.map(
                          (rec, i) => (
                            <li
                              key={`rec-insight-${i}`}
                              className="flex items-start"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <span className="dark:text-gray-300">{rec}</span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                  {screeningResults.recommendations
                    ?.candidate_improvement_suggestions?.length > 0 && (
                    <div>
                      <h5 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
                        Suggestions for Candidate Improvement
                      </h5>
                      <ul className="space-y-1">
                        {screeningResults.recommendations.candidate_improvement_suggestions.map(
                          (rec, i) => (
                            <li
                              key={`rec-candidate-${i}`}
                              className="flex items-start"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <span className="dark:text-gray-300">{rec}</span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Interview Preparation - New Section */}
                {screeningResults.interviewQuestions?.length > 0 && (
                  <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border dark:border-gray-600">
                    <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Suggested Interview Questions
                    </h4>
                    <div className="space-y-3">
                      {screeningResults.interviewQuestions
                        .slice(0, 3)
                        .map((q, i) => (
                          <div
                            key={i}
                            className="p-3 bg-gray-50 dark:bg-gray-600 rounded-lg"
                          >
                            <p className="font-medium dark:text-gray-200">
                              {q.question}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                              <span className="font-semibold">Purpose:</span>{" "}
                              {q.purpose}
                            </p>
                            {q.expected_answer_elements?.length > 0 && (
                              <div className="mt-2">
                                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                                  Look for:
                                </p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {q.expected_answer_elements.map((el, j) => (
                                    <span
                                      key={j}
                                      className="bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded text-xs"
                                    >
                                      {el}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-between mt-6">
                  <button
                    onClick={() => setActiveStep("parse")}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Back to Job Description
                  </button>

                  <button
                    onClick={() => {
                      // Reset state for a new screening
                      setJobDescription("");
                      setFile(null);
                      setParsedResume(null);
                      setScreeningResults(null);
                      setActiveStep("upload");
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                  >
                    Screen New Resume
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeScreening;
