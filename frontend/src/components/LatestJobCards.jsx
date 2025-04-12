import React from "react";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, Users, DollarSign, Clock } from "lucide-react";

const LatestJobCards = ({ job }) => {
  const navigate = useNavigate();

  // Format salary for display
  const formatSalary = (salary) => {
    if (!salary) return "Salary Not Disclosed";
    return `Ksh ${parseInt(salary).toLocaleString()}`;
  };

  // Format post date as relative time
  const formatPostDate = (dateString) => {
    if (!dateString) return "Date Unknown";

    const postedDate = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - postedDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffWeeks === 1) return "1 week ago";
    if (diffWeeks < 4) return `${diffWeeks} weeks ago`;
    if (diffMonths === 1) return "1 month ago";
    return `${diffMonths} months ago`;
  };

  return (
    <div
      onClick={() => navigate(`/description/${job._id}`)}
      className="p-6 rounded-xl shadow-md bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 
      cursor-pointer hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1"
    >
      <div className="flex flex-col md:flex-row gap-5">
        {/* Company Logo */}
        <div className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
          <img
            src={job?.company?.logo || "/placeholder-company.svg"}
            alt={job?.company?.name || "Company"}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "/placeholder-company.svg";
            }}
          />
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Top Row - Company & Location */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
            <div>
              <h1 className="font-semibold text-lg text-gray-800 dark:text-gray-200">
                {job?.company?.name || "Company Name"}
              </h1>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                <MapPin size={14} className="mr-1" />
                <span>{job?.location || "Location Not Available"}</span>
              </div>
            </div>

            <div className="mt-2 sm:mt-0">
              <Badge
                variant="outline"
                className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800"
              >
                <Clock size={12} className="mr-1" />
                {job?.jobType || "Job Type"}
              </Badge>
            </div>
          </div>

          {/* Job Title & Description */}
          <div className="mb-3">
            <h2 className="font-bold text-xl text-gray-900 dark:text-white">
              {job?.title || "Job Title"}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
              {job?.description ||
                "No description available for this position."}
            </p>
          </div>

          {/* Badges Row */}
          <div className="mt-auto pt-3 flex flex-wrap gap-2">
            <Badge
              variant="outline"
              className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800"
            >
              <Users size={12} className="mr-1" />
              {job?.position || "0"} Positions
            </Badge>

            <Badge
              variant="outline"
              className="bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800"
            >
              
              {formatSalary(job?.salary)}
            </Badge>

            <Badge
              variant="outline"
              className="bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800"
            >
              <Calendar size={12} className="mr-1" />
              <span title={new Date(job?.createdAt).toLocaleDateString()}>
                {formatPostDate(job?.createdAt)}
              </span>
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LatestJobCards;
