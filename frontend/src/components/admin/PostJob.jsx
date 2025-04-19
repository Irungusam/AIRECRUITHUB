import React, { useState, useEffect } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useSelector } from "react-redux";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import axios from "axios";
import { JOB_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";

const PostJob = () => {
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get("edit");
  const [isEditMode, setIsEditMode] = useState(false);
  const [input, setInput] = useState({
    title: "",
    description: "",
    requirements: "",
    salary: "",
    location: "",
    jobType: "",
    experience: "",
    position: 0,
    companyId: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetchingJob, setFetchingJob] = useState(false);
  const navigate = useNavigate();

  const { companies } = useSelector((store) => store.company);
  const { allAdminJobs } = useSelector((store) => store.job);

  // Fetch job data if in edit mode
  useEffect(() => {
    const fetchJobData = async () => {
      if (jobId) {
        setIsEditMode(true);
        setFetchingJob(true);

        // First, check if the job is available in the Redux store
        const jobFromStore = allAdminJobs?.find((job) => job._id === jobId);

        if (jobFromStore) {
          // Use data from Redux store if available
          setInput({
            title: jobFromStore.title || "",
            description: jobFromStore.description || "",
            requirements: jobFromStore.requirements || "",
            salary: jobFromStore.salary || "",
            location: jobFromStore.location || "",
            jobType: jobFromStore.jobType || "",
            experience: jobFromStore.experienceLevel || "",
            position: jobFromStore.position || 0,
            companyId: jobFromStore.company?._id || "",
            
          });
          setFetchingJob(false);
        } else {
          // Otherwise fetch from API
          try {
            // Try different endpoint patterns that might work with your API
            const res = await axios.get(
              `${JOB_API_END_POINT}/detail/${jobId}`,
              {
                withCredentials: true,
              }
            );

            if (res.data.success) {
              const jobData = res.data.job;
              setInput({
                title: jobData.title || "",
                description: jobData.description || "",
                requirements: jobData.requirements || "",
                salary: jobData.salary || "",
                location: jobData.location || "",
                jobType: jobData.jobType || "",
                experience: jobData.experienceLevel || "",
                position: jobData.position || 0,
                companyId: jobData.company?._id || "",
                
              });
            }
          } catch (firstError) {
            try {
              // Try alternative endpoint if the first one fails
              const res = await axios.get(`${JOB_API_END_POINT}/${jobId}`, {
                withCredentials: true,
              });

              if (res.data.success) {
                const jobData = res.data.job;
                setInput({
                  title: jobData.title || "",
                  description: jobData.description || "",
                  requirements: jobData.requirements || "",
                  salary: jobData.salary || "",
                  location: jobData.location || "",
                  jobType: jobData.jobType || "",
                  experience: jobData.experienceLevel || "",
                  position: jobData.position || 0,
                  companyId: jobData.company?._id || "",
                });
              }
            } catch (secondError) {
              toast.error("Failed to fetch job details");
              console.error("Error fetching job:", secondError);
            }
          } finally {
            setFetchingJob(false);
          }
        }
      }
    };

    fetchJobData();
  }, [jobId, allAdminJobs]);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const selectChangeHandler = (value) => {
    const selectedCompany = companies.find(
      (company) => company.name.toLowerCase() === value.toLowerCase()
    );
    if (selectedCompany) {
      setInput({ ...input, companyId: selectedCompany._id });
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      let res;
      if (isEditMode) {
        // Update existing job - try multiple possible API endpoint patterns
        try {
          res = await axios.put(`${JOB_API_END_POINT}/update/${jobId}`, input, {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          });
        } catch (error) {
          // If the first endpoint fails, try an alternative
          console.log("First update endpoint failed, trying alternative...");
          res = await axios.put(`${JOB_API_END_POINT}/${jobId}`, input, {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          });
        }
      } else {
        // Create new job
        res = await axios.post(`${JOB_API_END_POINT}/post`, input, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });
      }

      if (res.data.success) {
        toast.success(res.data.message || "Operation successful");
        navigate("/admin/jobs");
      } else {
        // Some APIs might return success: false with a message
        toast.error(res.data.message || "Operation failed");
      }
    } catch (error) {
      console.error("Error in job operation:", error);

      // More detailed error logging
      if (error.response) {
        console.log("Error response data:", error.response.data);
        console.log("Error response status:", error.response.status);
        toast.error(
          error.response.data?.message || `Error: ${error.response.status}`
        );
      } else if (error.request) {
        console.log("Error request:", error.request);
        toast.error("No response received from server");
      } else {
        console.log("Error message:", error.message);
        toast.error(error.message || "An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  // Find the current company name for the select
  const getCurrentCompanyName = () => {
    if (!input.companyId) return "";
    const company = companies.find((c) => c._id === input.companyId);
    return company?.name?.toLowerCase() || "";
  };

  if (fetchingJob) {
    return (
      <div>
        <Navbar />
        <div className="flex justify-center items-center h-96">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
          <span className="ml-2 text-lg text-gray-700 dark:text-gray-300">
            Loading job details...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center w-screen my-10">
        <form
          onSubmit={submitHandler}
          className="p-8 max-w-4xl w-full bg-white dark:bg-gray-800 shadow-xl rounded-lg border border-gray-300 dark:border-gray-700"
        >
          <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-gray-100 mb-6">
            {isEditMode ? "Edit Job Listing" : "Post a New Job"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <Label className="text-gray-800 dark:text-gray-200">Title</Label>
              <Input
                type="text"
                name="title"
                value={input.title}
                onChange={changeEventHandler}
                className="focus:outline-none focus:ring-2 focus:ring-indigo-600 w-full my-1 px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
                required
              />
            </div>
            <div>
              <Label className="text-gray-800 dark:text-gray-200">
                Description
              </Label>
              <Input
                type="text"
                name="description"
                value={input.description}
                onChange={changeEventHandler}
                className="focus:outline-none focus:ring-2 focus:ring-indigo-600 w-full my-1 px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
                required
              />
            </div>
            <div>
              <Label className="text-gray-800 dark:text-gray-200">
                Job Requirements
              </Label>
              <Input
                type="text"
                name="requirements"
                value={input.requirements}
                onChange={changeEventHandler}
                className="focus:outline-none focus:ring-2 focus:ring-indigo-600 w-full my-1 px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
                required
              />
            </div>
            <div>
              <Label className="text-gray-800 dark:text-gray-200">Salary</Label>
              <Input
                type="text"
                name="salary"
                value={input.salary}
                onChange={changeEventHandler}
                className="focus:outline-none focus:ring-2 focus:ring-indigo-600 w-full my-1 px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
                required
              />
            </div>
            <div>
              <Label className="text-gray-800 dark:text-gray-200">
                Location
              </Label>
              <Input
                type="text"
                name="location"
                value={input.location}
                onChange={changeEventHandler}
                className="focus:outline-none focus:ring-2 focus:ring-indigo-600 w-full my-1 px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
                required
              />
            </div>
            <div>
              <Label className="text-gray-800 dark:text-gray-200">
                Job Type
              </Label>
              <Input
                type="text"
                name="jobType"
                placeholder="e.g., Full-time, Part-time"
                value={input.jobType}
                onChange={changeEventHandler}
                className="focus:outline-none focus:ring-2 focus:ring-indigo-600 w-full my-1 px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
                required
              />
            </div>
            <div>
              <Label className="text-gray-800 dark:text-gray-200">
                Years of Experience Required
              </Label>
              <Input
                type="number"
                name="experience"
                value={input.experience}
                onChange={changeEventHandler}
                className="focus:outline-none focus:ring-2 focus:ring-indigo-600 w-full my-1 px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
                required
              />
            </div>
            <div>
              <Label className="text-gray-800 dark:text-gray-200">
                No of Position
              </Label>
              <Input
                type="number"
                name="position"
                value={input.position}
                onChange={changeEventHandler}
                className="focus:outline-none focus:ring-2 focus:ring-indigo-600 w-full my-1 px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
                required
              />
            </div>
            {companies.length > 0 && (
              <div>
                <Label className="text-gray-800 dark:text-gray-200">
                  Company
                </Label>
                <Select
                  onValueChange={selectChangeHandler}
                  defaultValue={getCurrentCompanyName()}
                >
                  <SelectTrigger className="w-full my-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:bg-gray-700 dark:text-white dark:border-gray-600">
                    <SelectValue placeholder="Select a Company" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {companies.map((company) => (
                        <SelectItem
                          value={company?.name?.toLowerCase()}
                          key={company._id}
                        >
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {isEditMode && (
            <div className="mt-6 text-sm text-gray-600 dark:text-gray-400">
              
            </div>
          )}

          {loading ? (
            <Button
              disabled
              className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md"
            >
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditMode ? "Updating..." : "Posting..."}
            </Button>
          ) : (
            <Button
              type="submit"
              className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md"
            >
              {isEditMode ? "Update Job" : "Post New Job"}
            </Button>
          )}
          {companies.length === 0 && (
            <p className="text-xs text-red-600 font-semibold text-center my-4">
              *Please register a company first before posting a job
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default PostJob;
