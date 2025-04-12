import React from "react";
import { Button } from "./ui/button";
import {
  Bookmark,
  Calendar,
  Users,
  BriefcaseBusiness,
  DollarSign,
  ArrowRight,
  Clock,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";

const Job = ({ job }) => {
  const navigate = useNavigate();

  const daysAgoFunction = (mongodbTime) => {
    if (!mongodbTime) return "New";
    const createdAt = new Date(mongodbTime);
    const currentTime = new Date();
    const timeDifference = currentTime - createdAt;
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    return `${days} days ago`;
  };

  // Generate deterministic color based on company name for consistent color per company
  const getCompanyColor = (companyName) => {
    if (!companyName) return "#e3dbfa"; // Default color

    const pastelColors = [
      "#ffe1cc",
      "#fbe2f4",
      "#e3dbfa",
      "#d4f5ed",
      "#ffecd1",
      "#f6e8ea",
      "#e6e6fa",
      "#c3f3ff",
      "#aec6cf",
    ];

    // Use company name to get a consistent index
    let sum = 0;
    for (let i = 0; i < companyName.length; i++) {
      sum += companyName.charCodeAt(i);
    }

    return pastelColors[sum % pastelColors.length];
  };

  const companyName = job?.company?.name || "Company";
  const companyInitial = companyName.charAt(0).toUpperCase();
  const pastelBackgroundColor = getCompanyColor(companyName);

  // Format salary with commas and handle edge cases
  const formatSalary = (salary) => {
    if (!salary) return "Salary not disclosed";
    return `Ksh ${parseInt(salary).toLocaleString()}`;
  };

  return (
    <div className="rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      {/* Top Section with Background Color */}
      <div className="relative">
        {/* Bookmark Button */}
        <Button
          variant="outline"
          className="absolute top-4 right-4 rounded-full bg-white/90 dark:bg-gray-700/90 hover:bg-white dark:hover:bg-gray-700 p-2 shadow-sm z-10"
          size="icon"
        >
          <Bookmark className="h-4 w-4 text-gray-700 dark:text-gray-300" />
        </Button>

        {/* Posted Time Badge */}
        <Badge
          variant="outline"
          className="absolute top-4 left-4 bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 z-10 flex items-center gap-1"
        >
          <Clock className="h-3 w-3" />
          {daysAgoFunction(job?.createdAt)}
        </Badge>

        {/* Color Background Section */}
        <div
          className="p-5 pt-12"
          style={{ backgroundColor: pastelBackgroundColor }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="h-12 w-12 bg-white dark:bg-gray-700 shadow-sm">
              {job?.company?.logo ? (
                <AvatarImage src={job?.company?.logo} alt={companyName} />
              ) : (
                <AvatarFallback className="text-lg font-medium">
                  {companyInitial}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <h3 className="font-semibold text-base text-gray-800 dark:text-gray-900">
                {companyName}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-700">
                {job?.location || "Location not specified"}
              </p>
            </div>
          </div>

          <h2 className="font-bold text-xl mb-2 text-gray-800 dark:text-gray-700 line-clamp-1">
            {job?.title || "Job Title"}
          </h2>
          <p className="text-sm text-gray-700 dark:text-gray-800 mb-4 line-clamp-2">
            {job?.description || "No description available"}
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            <Badge className="flex items-center gap-1 bg-white/80 dark:bg-gray-700/80 text-gray-700 dark:text-gray-300">
              <Users className="h-3 w-3" />
              {job?.position || "0"} Positions
            </Badge>
            <Badge className="flex items-center gap-1 bg-white/80 dark:bg-gray-700/80 text-gray-700 dark:text-gray-300">
              <BriefcaseBusiness className="h-3 w-3" />
              {job?.jobType || "Full-time"}
            </Badge>
            <Badge className="flex items-center gap-1 bg-white/80 dark:bg-gray-700/80 text-gray-700 dark:text-gray-300">
              
              {formatSalary(job?.salary)}
            </Badge>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center px-5 py-4 bg-white dark:bg-gray-800">
        <Button
          onClick={() => navigate(`/description/${job?._id}`)}
          className="bg-gray-900 hover:bg-black dark:bg-gray-700 dark:hover:bg-gray-600 text-white px-4 py-2 rounded-full flex items-center gap-2"
        >
          View Details
          <ArrowRight className="h-4 w-4" />
        </Button>
        
      </div>
    </div>
  );
};

export default Job;
