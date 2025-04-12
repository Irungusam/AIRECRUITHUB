import React, { useState } from "react";
import Navbar from "./shared/Navbar";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  Contact,
  Mail,
  Pen,
  Briefcase,
  GraduationCap,
  MapPin,
  Clock,
  Award,
} from "lucide-react";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import AppliedJobTable from "./AppliedJobTable";
import UpdateProfileDialog from "./UpdateProfileDialog";
import { useSelector } from "react-redux";
import useGetAppliedJobs from "@/hooks/useGetAppliedJobs";

const Profile = () => {
  useGetAppliedJobs();
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);

  // Use a fallback avatar URL only if necessary
  const avatarUrl =
    user?.profile?.profilePhoto ||
    user?._json?.picture ||
    "/default-avatar.jpg";

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Navbar />

      {/* Profile Card */}
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl my-8 p-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-6">
            <Avatar className="h-28 w-28 border-2 border-gray-300 dark:border-gray-600 shadow-lg">
              <AvatarImage src={avatarUrl} alt="profile" />
            </Avatar>
            <div>
              <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                {user?.fullname || ""}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                {user?.profile?.bio || "No bio available"}
              </p>

              {/* Professional title */}
              <p className="text-blue-600 dark:text-blue-400 font-medium mt-1">
                {user?.profile?.professionalTitle || ""}
              </p>

              {/* Location */}
              {user?.profile?.location && (
                <div className="flex items-center mt-2 text-gray-600 dark:text-gray-300">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{user.profile.location}</span>
                </div>
              )}
            </div>
          </div>
          <Button
            onClick={() => setOpen(true)}
            className="text-right bg-blue-600 text-white hover:bg-blue-500 rounded-full p-2"
            variant="outline"
          >
            <Pen className="h-5 w-5" />
          </Button>
        </div>

        {/* Contact Information */}
        <div className="my-6 space-y-3">
          {user?.email && (
            <div className="flex items-center gap-3">
              <Mail className="text-gray-600 dark:text-gray-300" />
              <span className="text-gray-700 dark:text-gray-200">
                {user.email}
              </span>
            </div>
          )}
          {user?.phoneNumber && (
            <div className="flex items-center gap-3">
              <Contact className="text-gray-600 dark:text-gray-300" />
              <span className="text-gray-700 dark:text-gray-200">
                {user.phoneNumber}
              </span>
            </div>
          )}
        </div>

        {/* Job Preferences Section */}
        <div className="my-6 border-t border-gray-200 dark:border-gray-700 pt-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
            <Briefcase className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
            Job Preferences
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Job Types */}
            <div>
              <Label className="text-gray-600 dark:text-gray-400">
                Job Types
              </Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {user?.profile?.jobPreferences?.jobTypes?.length > 0 ? (
                  user.profile.jobPreferences.jobTypes.map((type, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="bg-blue-50 dark:bg-blue-900/20"
                    >
                      {type}
                    </Badge>
                  ))
                ) : (
                  <span className="text-gray-500 dark:text-gray-400">
                    Not specified
                  </span>
                )}
              </div>
            </div>

            {/* Desired Salary */}
            <div>
              <Label className="text-gray-600 dark:text-gray-400">
                Desired Salary
              </Label>
              <p className="text-gray-800 dark:text-gray-200 mt-1">
                {user?.profile?.jobPreferences?.desiredSalary ||
                  "Not specified"}
              </p>
            </div>

            {/* Desired Location */}
            <div>
              <Label className="text-gray-600 dark:text-gray-400">
                Desired Location
              </Label>
              <p className="text-gray-800 dark:text-gray-200 mt-1">
                {user?.profile?.jobPreferences?.desiredLocation ||
                  "Not specified"}
              </p>
            </div>

            {/* Willing to Relocate */}
            <div>
              <Label className="text-gray-600 dark:text-gray-400">
                Willing to Relocate
              </Label>
              <p className="text-gray-800 dark:text-gray-200 mt-1">
                {user?.profile?.jobPreferences?.willingToRelocate === true
                  ? "Yes"
                  : user?.profile?.jobPreferences?.willingToRelocate === false
                  ? "No"
                  : "Not specified"}
              </p>
            </div>

            {/* Availability */}
            <div>
              <Label className="text-gray-600 dark:text-gray-400">
                Availability
              </Label>
              {user?.profile?.jobPreferences?.availability ? (
                <div className="flex items-center mt-1">
                  <Clock className="h-4 w-4 mr-1 text-gray-500 dark:text-gray-400" />
                  <span className="text-gray-800 dark:text-gray-200">
                    {user.profile.jobPreferences.availability}
                  </span>
                </div>
              ) : (
                <p className="text-gray-800 dark:text-gray-200 mt-1">
                  Not specified
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="my-6 border-t border-gray-200 dark:border-gray-700 pt-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {user?.profile?.skills?.length > 0 ? (
              user.profile.skills.map((skill, index) => (
                <Badge
                  key={index}
                  className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200"
                >
                  {skill}
                </Badge>
              ))
            ) : (
              <span className="text-gray-500 dark:text-gray-400">
                No skills listed
              </span>
            )}
          </div>
        </div>

        {/* Experience Section */}
        <div className="my-6 border-t border-gray-200 dark:border-gray-700 pt-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
            <Briefcase className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
            Work Experience
          </h2>
          {user?.profile?.experience?.length > 0 ? (
            user.profile.experience.map((job, index) => (
              <div
                key={index}
                className="mb-4 pb-4 border-b border-gray-100 dark:border-gray-700 last:border-0"
              >
                <h3 className="font-medium text-gray-800 dark:text-gray-100">
                  {job.position}
                </h3>
                <div className="text-gray-600 dark:text-gray-300">
                  {job.company}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {job.duration}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mt-2">
                  {job.description}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              No work experience listed
            </p>
          )}
        </div>

        {/* Education Section */}
        <div className="my-6 border-t border-gray-200 dark:border-gray-700 pt-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
            <GraduationCap className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
            Education
          </h2>
          {user?.profile?.education?.length > 0 ? (
            user.profile.education.map((edu, index) => (
              <div key={index} className="mb-4">
                <h3 className="font-medium text-gray-800 dark:text-gray-100">
                  {edu.institution}
                </h3>
                <div className="text-gray-600 dark:text-gray-300">
                  {edu.degree}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Graduated {edu.graduationYear}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              No education listed
            </p>
          )}
        </div>

        {/* Certifications Section */}
        <div className="my-6 border-t border-gray-200 dark:border-gray-700 pt-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
            <Award className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
            Certifications
          </h2>
          {user?.profile?.certifications?.length > 0 ? (
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
              {user.profile.certifications.map((cert, index) => (
                <li key={index} className="mb-1">
                  {cert}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              No certifications listed
            </p>
          )}
        </div>

        {/* Resume Link */}
        <div className="my-6 border-t border-gray-200 dark:border-gray-700 pt-6">
          <Label className="text-md font-semibold text-gray-800 dark:text-gray-200 flex items-center">
            <Briefcase className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
            Resume:
          </Label>
          {user?.profile?.resume ? (
            <a
              target="_blank"
              href={user.profile.resume}
              className="text-blue-500 dark:text-blue-300 hover:underline cursor-pointer"
            >
              {user?.profile?.resumeOriginalName || "Download Resume"}
            </a>
          ) : (
            <span className="text-gray-500 dark:text-gray-400">
              No resume uploaded
            </span>
          )}
        </div>
      </div>

      {/* Applied Jobs Section */}
            <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 my-4">Applied Jobs</h1>
                <AppliedJobTable />
            </div>

      {/* Update Profile Dialog */}
      <UpdateProfileDialog open={open} setOpen={setOpen} />
    </div>
  );
};

export default Profile;
