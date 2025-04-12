import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import {
  MoreHorizontal,
  FileText,
  Check,
  X,
  User,
  Mail,
  Contact,
  Briefcase,
  GraduationCap,
  MapPin,
  Clock,
  Award,
  Pen,
} from "lucide-react";

// UI Components
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Label } from "../ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

// Constants
import { APPLICATION_API_END_POINT } from "@/utils/constant";

const STATUS_ACTIONS = [
  { name: "Accepted", icon: <Check size={14} className="text-green-500" /> },
  { name: "Rejected", icon: <X size={14} className="text-red-500" /> },
];

const ApplicantsTable = () => {
  const { applicants } = useSelector((store) => store.application);
  const [loadingStates, setLoadingStates] = useState({});
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);

  const updateStatus = async (status, id) => {
    // Set loading state for this specific action
    setLoadingStates((prev) => ({ ...prev, [id]: true }));

    try {
      axios.defaults.withCredentials = true;
      const res = await axios.post(
        `${APPLICATION_API_END_POINT}/status/${id}/update`,
        { status }
      );

      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      // Clear loading state
      setLoadingStates((prev) => ({ ...prev, [id]: false }));
    }
  };

  // Format date to be more readable
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const openProfileDialog = (applicant) => {
    setSelectedApplicant(applicant);
    setProfileDialogOpen(true);
  };

  return (
    <>
      <div className="overflow-x-auto shadow-lg border rounded-lg dark:border-gray-700">
        <Table className="table-auto w-full text-sm">
          <TableCaption className="text-lg font-semibold mb-4 dark:text-gray-300">
            List of Recent Applicants
          </TableCaption>

          <TableHeader className="bg-gray-100 dark:bg-gray-800">
            <TableRow>
              <TableHead className="text-left px-4 py-3 dark:text-gray-300">
                Full Name
              </TableHead>
              <TableHead className="text-left px-4 py-3 dark:text-gray-300">
                Email
              </TableHead>
              <TableHead className="text-left px-4 py-3 dark:text-gray-300">
                Contact
              </TableHead>
              <TableHead className="text-left px-4 py-3 dark:text-gray-300">
                Resume
              </TableHead>
              <TableHead className="text-left px-4 py-3 dark:text-gray-300">
                Date Applied
              </TableHead>
              <TableHead className="text-left px-4 py-3 dark:text-gray-300">
                Profile
              </TableHead>
              <TableHead className="text-right px-4 py-3 dark:text-gray-300">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-200 dark:divide-gray-700">
            {applicants?.applications?.length > 0 ? (
              applicants.applications.map((item) => (
                <TableRow
                  key={item._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <TableCell className="px-4 py-3 font-medium dark:text-gray-300">
                    {item?.applicant?.fullname || "N/A"}
                  </TableCell>

                  <TableCell className="px-4 py-3 dark:text-gray-300">
                    {item?.applicant?.email || "N/A"}
                  </TableCell>

                  <TableCell className="px-4 py-3 dark:text-gray-300">
                    {item?.applicant?.phoneNumber || "N/A"}
                  </TableCell>

                  <TableCell className="px-4 py-3">
                    {item?.applicant?.profile?.resume ? (
                      <a
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-500 cursor-pointer flex items-center gap-1"
                        href={item.applicant.profile.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`View resume for ${
                          item?.applicant?.fullname || "applicant"
                        }`}
                      >
                        <FileText size={14} />
                        <span>View Resume</span>
                      </a>
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400">
                        Not Available
                      </span>
                    )}
                  </TableCell>

                  <TableCell className="px-4 py-3 dark:text-gray-300">
                    {formatDate(item?.applicant?.createdAt)}
                  </TableCell>

                  <TableCell className="px-4 py-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1 text-xs"
                      onClick={() => openProfileDialog(item.applicant)}
                    >
                      <User size={14} />
                      View Profile
                    </Button>
                  </TableCell>

                  <TableCell className="px-4 py-3 text-right">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          aria-label="Open actions menu"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-40 p-1 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
                        {STATUS_ACTIONS.map((action) => (
                          <Button
                            key={action.name}
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start text-sm px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-700"
                            onClick={() => updateStatus(action.name, item?._id)}
                            disabled={loadingStates[item?._id]}
                          >
                            <div className="flex items-center gap-2">
                              {action.icon}
                              <span className="font-medium dark:text-gray-300">
                                {action.name}
                              </span>
                            </div>
                          </Button>
                        ))}
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-gray-500 dark:text-gray-400"
                >
                  No applicants found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Profile Dialog */}
      <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Applicant Profile
            </DialogTitle>
          </DialogHeader>

          {selectedApplicant && (
            <div className="mt-4">
              {/* Profile Card */}
              <div className="bg-white dark:bg-gray-800 rounded-lg">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-6">
                    <Avatar className="h-20 w-20 border-2 border-gray-300 dark:border-gray-600 shadow-lg">
                      <AvatarImage
                        src={
                          selectedApplicant?.profile?.profilePhoto ||
                          "/default-avatar.jpg"
                        }
                        alt="profile"
                      />
                    </Avatar>
                    <div>
                      <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                        {selectedApplicant?.fullname || ""}
                      </h1>
                      <p className="text-gray-600 dark:text-gray-300 mt-2">
                        {selectedApplicant?.profile?.bio || "No bio available"}
                      </p>

                      {/* Professional title */}
                      <p className="text-blue-600 dark:text-blue-400 font-medium mt-1">
                        {selectedApplicant?.profile?.professionalTitle || ""}
                      </p>

                      {/* Location */}
                      {selectedApplicant?.profile?.location && (
                        <div className="flex items-center mt-2 text-gray-600 dark:text-gray-300">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{selectedApplicant.profile.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="my-6 space-y-3">
                  {selectedApplicant?.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="text-gray-600 dark:text-gray-300" />
                      <span className="text-gray-700 dark:text-gray-200">
                        {selectedApplicant.email}
                      </span>
                    </div>
                  )}
                  {selectedApplicant?.phoneNumber && (
                    <div className="flex items-center gap-3">
                      <Contact className="text-gray-600 dark:text-gray-300" />
                      <span className="text-gray-700 dark:text-gray-200">
                        {selectedApplicant.phoneNumber}
                      </span>
                    </div>
                  )}
                </div>

                {/* Job Preferences Section */}
                {selectedApplicant?.profile?.jobPreferences && (
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
                          {selectedApplicant?.profile?.jobPreferences?.jobTypes
                            ?.length > 0 ? (
                            selectedApplicant.profile.jobPreferences.jobTypes.map(
                              (type, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="bg-blue-50 dark:bg-blue-900/20"
                                >
                                  {type}
                                </Badge>
                              )
                            )
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
                          {selectedApplicant?.profile?.jobPreferences
                            ?.desiredSalary || "Not specified"}
                        </p>
                      </div>

                      {/* Desired Location */}
                      <div>
                        <Label className="text-gray-600 dark:text-gray-400">
                          Desired Location
                        </Label>
                        <p className="text-gray-800 dark:text-gray-200 mt-1">
                          {selectedApplicant?.profile?.jobPreferences
                            ?.desiredLocation || "Not specified"}
                        </p>
                      </div>

                      {/* Willing to Relocate */}
                      <div>
                        <Label className="text-gray-600 dark:text-gray-400">
                          Willing to Relocate
                        </Label>
                        <p className="text-gray-800 dark:text-gray-200 mt-1">
                          {selectedApplicant?.profile?.jobPreferences
                            ?.willingToRelocate === true
                            ? "Yes"
                            : selectedApplicant?.profile?.jobPreferences
                                ?.willingToRelocate === false
                            ? "No"
                            : "Not specified"}
                        </p>
                      </div>

                      {/* Availability */}
                      <div>
                        <Label className="text-gray-600 dark:text-gray-400">
                          Availability
                        </Label>
                        {selectedApplicant?.profile?.jobPreferences
                          ?.availability ? (
                          <div className="flex items-center mt-1">
                            <Clock className="h-4 w-4 mr-1 text-gray-500 dark:text-gray-400" />
                            <span className="text-gray-800 dark:text-gray-200">
                              {
                                selectedApplicant.profile.jobPreferences
                                  .availability
                              }
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
                )}

                {/* Skills Section */}
                <div className="my-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
                    Skills
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {selectedApplicant?.profile?.skills?.length > 0 ? (
                      selectedApplicant.profile.skills.map((skill, index) => (
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
                  {selectedApplicant?.profile?.experience?.length > 0 ? (
                    selectedApplicant.profile.experience.map((job, index) => (
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
                  {selectedApplicant?.profile?.education?.length > 0 ? (
                    selectedApplicant.profile.education.map((edu, index) => (
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
                  {selectedApplicant?.profile?.certifications?.length > 0 ? (
                    <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                      {selectedApplicant.profile.certifications.map(
                        (cert, index) => (
                          <li key={index} className="mb-1">
                            {cert}
                          </li>
                        )
                      )}
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
                  {selectedApplicant?.profile?.resume ? (
                    <a
                      target="_blank"
                      href={selectedApplicant.profile.resume}
                      className="text-blue-500 dark:text-blue-300 hover:underline cursor-pointer"
                    >
                      {selectedApplicant?.profile?.resumeOriginalName ||
                        "Download Resume"}
                    </a>
                  ) : (
                    <span className="text-gray-500 dark:text-gray-400">
                      No resume uploaded
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ApplicantsTable;
