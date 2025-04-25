import React, { useEffect, useState } from "react";
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
import { Edit2, Eye, MoreHorizontal, Trash2 } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { JOB_API_END_POINT } from "@/utils/constant";
import { removeJob } from "../../redux/jobSlice";
import { toast } from "sonner";

const AdminJobsTable = () => {
  const { allAdminJobs, searchJobByText } = useSelector((store) => store.job);
  const [filterJobs, setFilterJobs] = useState(allAdminJobs);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const filteredJobs = allAdminJobs.filter((job) => {
      if (!searchJobByText) {
        return true;
      }
      return (
        job?.title?.toLowerCase().includes(searchJobByText.toLowerCase()) ||
        job?.company?.name.toLowerCase().includes(searchJobByText.toLowerCase())
      );
    });
    setFilterJobs(filteredJobs);
  }, [allAdminJobs, searchJobByText]);

  const handleDeleteJob = async (jobId) => {
    try {
      const res = await axios.delete(`${JOB_API_END_POINT}/delete/${jobId}`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.data.success) {
        dispatch(removeJob(jobId));
        toast.success("Job deleted successfully", {
          description: "The job posting has been permanently removed.",
          action: {
            label: "Close",
            onClick: () => {},
          },
        });
      } else {
        toast.error("Failed to delete job", {
          description: res.data.message || "Please try again later.",
        });
      }
    } catch (error) {
      console.error("Error deleting job:", error);

      let errorMessage = "An unexpected error occurred";
      if (error.response) {
        errorMessage =
          error.response.data?.message || `Error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = "No response received from server";
      } else {
        errorMessage = error.message;
      }

      toast.error("Deletion failed", {
        description: errorMessage,
        action: {
          label: "Retry",
          onClick: () => handleDeleteJob(jobId),
        },
      });
    }
  };

  return (
    <div className="overflow-x-auto bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
      <Table className="text-gray-800 dark:text-gray-300">
        <TableCaption className="text-gray-700 dark:text-gray-400">
          A list of recent posted jobs
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="text-gray-700 dark:text-gray-300">
              Company
            </TableHead>
            <TableHead className="text-gray-700 dark:text-gray-300">
              Role
            </TableHead>
            <TableHead className="text-gray-700 dark:text-gray-300">
              Date
            </TableHead>
            <TableHead className="text-right text-gray-700 dark:text-gray-300">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filterJobs?.map((job) => (
            <TableRow
              key={job._id}
              className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
            >
              <TableCell className="text-gray-900 dark:text-gray-300">
                {job?.company?.name}
              </TableCell>
              <TableCell className="text-gray-600 dark:text-gray-400">
                {job?.title}
              </TableCell>
              <TableCell className="text-gray-500 dark:text-gray-400">
                {job?.createdAt.split("T")[0]}
              </TableCell>
              <TableCell className="text-right cursor-pointer">
                <Popover>
                  <PopoverTrigger>
                    <MoreHorizontal className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-400 transition-all" />
                  </PopoverTrigger>
                  <PopoverContent className="w-40 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-300">
                    <div
                      onClick={() =>
                        navigate(`/admin/jobs/create?edit=${job._id}`)
                      }
                      className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md"
                    >
                      <Edit2 className="w-4 h-4 text-gray-500 dark:text-gray-300" />
                      <span>Edit</span>
                    </div>
                    <div
                      onClick={() =>
                        navigate(`/admin/jobs/${job._id}/applicants`)
                      }
                      className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md"
                    >
                      <Eye className="w-4 h-4 text-gray-500 dark:text-gray-300" />
                      <span>Applicants</span>
                    </div>
                    <div
                      onClick={() => {
                        toast("Deleting job posting", {
                          description:
                            "Are you sure you want to delete this job?",
                          action: {
                            label: "Confirm",
                            onClick: () => handleDeleteJob(job._id),
                          },
                          cancel: {
                            label: "Cancel",
                            onClick: () => {},
                          },
                        });
                      }}
                      className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md text-red-500 dark:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </div>
                  </PopoverContent>
                </Popover>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminJobsTable;
