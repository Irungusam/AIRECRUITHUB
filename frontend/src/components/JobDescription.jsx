import React, { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from "@/utils/constant";
import { setSingleJob } from "@/redux/jobSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  Home,
  ArrowLeft,
  Briefcase,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Clock,
  Building,
  CheckCircle,
  Globe,
  FileText,
} from "lucide-react";

// Simplified version without Card components
const JobDescription = () => {
  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);
  const isInitiallyApplied =
    singleJob?.applications?.some(
      (application) => application.applicant === user?._id
    ) || false;
  const [isApplied, setIsApplied] = useState(isInitiallyApplied);
  const [loading, setLoading] = useState(true);

  const params = useParams();
  const jobId = params.id;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const applyJobHandler = async () => {
    try {
      const res = await axios.get(
        `${APPLICATION_API_END_POINT}/apply/${jobId}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        setIsApplied(true);
        const updatedSingleJob = {
          ...singleJob,
          applications: [...singleJob.applications, { applicant: user?._id }],
        };
        dispatch(setSingleJob(updatedSingleJob));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    const fetchSingleJob = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));
          setIsApplied(
            res.data.job.applications.some(
              (application) => application.applicant === user?._id
            )
          );
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to load job details");
      } finally {
        setLoading(false);
      }
    };
    fetchSingleJob();
  }, [jobId, dispatch, user?._id]);

  // Format date to be more readable
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Hero Section with Gradient Background */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-4 mb-6">
            <Button
              onClick={() => navigate("/jobs")}
              className="text-white bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Jobs</span>
            </Button>
            <Button
              onClick={() => navigate("/")}
              className="text-white bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Button>
          </div>

          {loading ? (
            <div className="animate-pulse">
              <div className="h-10 w-3/4 mb-4 bg-white bg-opacity-20 rounded"></div>
              <div className="flex gap-2 mb-4">
                <div className="h-6 w-24 rounded-full bg-white bg-opacity-20"></div>
                <div className="h-6 w-24 rounded-full bg-white bg-opacity-20"></div>
                <div className="h-6 w-32 rounded-full bg-white bg-opacity-20"></div>
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-4xl font-bold text-white mb-4">
                {singleJob?.title || "Job Title"}
              </h1>
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <Badge className="bg-white bg-opacity-20 text-white font-medium text-sm px-4 py-1 rounded-full">
                  {singleJob?.position ?? 0} Position
                  {singleJob?.positions !== 1 ? "s" : ""}
                </Badge>
                <Badge className="bg-white bg-opacity-20 text-white font-medium text-sm px-4 py-1 rounded-full">
                  {singleJob?.jobType ?? "N/A"}
                </Badge>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative -mt-8">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Left Column - Job Details */}
          <div className="md:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold">Job Details</h2>
              </div>
              <div className="pt-6">
                {loading ? (
                  <div className="space-y-4 animate-pulse">
                    <div className="h-6 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-6 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-6 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-24 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                          <Briefcase className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Job Title
                          </p>
                          <p className="font-medium">{singleJob?.title}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                          <MapPin className="h-5 w-5 text-green-600 dark:text-green-300" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Location
                          </p>
                          <p className="font-medium">
                            {singleJob?.location || "Remote"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                          <DollarSign className="h-5 w-5 text-purple-600 dark:text-purple-300" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Salary
                          </p>
                          <p className="font-medium">
                            Ksh {singleJob?.salary?.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-full">
                          <Clock className="h-5 w-5 text-orange-600 dark:text-orange-300" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Experience
                          </p>
                          <p className="font-medium">
                            {singleJob?.experienceLevel ?? 0}{" "}
                            {singleJob?.experienceLevel === 1
                              ? "Year"
                              : "Years"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-red-100 dark:bg-red-900 rounded-full">
                          <Users className="h-5 w-5 text-red-600 dark:text-red-300" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Applicants
                          </p>
                          <p className="font-medium">
                            {singleJob?.applications?.length || 0}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-pink-100 dark:bg-pink-900 rounded-full">
                          <Calendar className="h-5 w-5 text-pink-600 dark:text-pink-300" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Posted On
                          </p>
                          <p className="font-medium">
                            {formatDate(singleJob?.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                      <h3 className="text-xl font-semibold mb-4">
                        Job Description
                      </h3>
                      <div className="prose dark:prose-invert max-w-none">
                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                          {singleJob?.description}
                        </p>
                      </div>
                    </div>

                    {/* Job Requirements Section */}
                    {singleJob?.requirements &&
                      singleJob.requirements.length > 0 && (
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
                          <h3 className="text-xl font-semibold mb-4 flex items-center">
                            <span>Requirements</span>
                          </h3>
                          <ul className="space-y-3">
                            {singleJob.requirements.map(
                              (requirement, index) => (
                                <li
                                  key={index}
                                  className="flex items-start gap-3"
                                >
                                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                                  <span className="text-gray-700 dark:text-gray-300">
                                    {requirement}
                                  </span>
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Company Info and Apply */}
          <div className="md:col-span-1">
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="pb-2 mb-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-bold">Company</h3>
                </div>
                <div>
                  {loading ? (
                    <div className="space-y-4 animate-pulse">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                        <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex items-center gap-3 mb-4">
                          {singleJob?.company?.logo ? (
                            <div className="flex-shrink-0">
                              <img
                                src={singleJob.company.logo}
                                alt={`${singleJob.company.name} logo`}
                                className="h-12 w-12 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "default-company-logo.png";
                                }}
                              />
                            </div>
                          ) : (
                            <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full">
                              <Building className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                            </div>
                          )}

                          <p className="font-medium">
                            {singleJob?.company?.name || "Company Name"}
                          </p>
                        </div>
                      </div>

                      {/* Company Description */}
                      {singleJob?.company?.description && (
                        <div className="mt-4">
                          <div className="flex items-center gap-2 mb-2">
                            <FileText className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              About the Company
                            </h4>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {singleJob.company.description}
                          </p>
                        </div>
                      )}

                      {/* Company Website */}
                      {singleJob?.company?.website && (
                        <div className="mt-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Globe className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Website
                            </h4>
                          </div>
                          <a
                            href={
                              singleJob.company.website.startsWith("http")
                                ? singleJob.company.website
                                : `https://${singleJob.company.website}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline break-all"
                          >
                            {singleJob.company.website.replace(
                              /^https?:\/\//,
                              ""
                            )}
                          </a>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                {loading ? (
                  <div className="h-12 w-full bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                ) : (
                  <Button
                    onClick={isApplied ? null : applyJobHandler}
                    disabled={isApplied}
                    className={`w-full py-6 text-lg font-medium rounded-lg ${
                      isApplied
                        ? "bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-300 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    {isApplied ? "Already Applied" : "Apply Now"}
                  </Button>
                )}

                {isApplied && (
                  <p className="text-center mt-4 text-sm text-gray-500 dark:text-gray-400">
                    You've already applied for this position.
                  </p>
                )}
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg shadow-lg p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <h3 className="font-semibold text-blue-600 dark:text-blue-400">
                    Quick Apply Tips
                  </h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li>• Update your profile to increase chances</li>
                  <li>• Applications are reviewed within 7 days</li>
                  <li>• Make sure your contact details are correct</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDescription;
