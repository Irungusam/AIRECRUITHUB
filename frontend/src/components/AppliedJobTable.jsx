import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { useSelector } from "react-redux";

const AppliedJobTable = () => {
  const { allAppliedJobs } = useSelector((store) => store.job);

  return (
    <div className="overflow-x-auto bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
      <Table className="text-gray-800 dark:text-gray-300">
        <TableCaption className="text-gray-700 dark:text-gray-400">
          A list of your applied jobs
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="text-gray-700 dark:text-gray-300">
              Date
            </TableHead>
            <TableHead className="text-gray-700 dark:text-gray-300">
              Job Role
            </TableHead>
            <TableHead className="text-gray-700 dark:text-gray-300">
              Company
            </TableHead>
            <TableHead className="text-right text-gray-700 dark:text-gray-300">
              Status
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allAppliedJobs.length <= 0 ? (
            <TableRow>
              <TableCell
                colSpan={4}
                className="text-gray-700 dark:text-gray-400 text-center"
              >
                You haven't applied any job yet.
              </TableCell>
            </TableRow>
          ) : (
            allAppliedJobs.map((appliedJob) => (
              <TableRow
                key={appliedJob._id}
                className="hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <TableCell className="text-gray-700 dark:text-gray-300">
                  {appliedJob?.createdAt?.split("T")[0]}
                </TableCell>
                <TableCell className="text-gray-700 dark:text-gray-300">
                  {appliedJob.job?.title}
                </TableCell>
                <TableCell className="text-gray-700 dark:text-gray-300">
                  {appliedJob.job?.company?.name}
                </TableCell>
                <TableCell className="text-right">
                  <Badge
                    className={`${
                      appliedJob?.status === "rejected"
                        ? "bg-red-400 dark:bg-red-600"
                        : appliedJob.status === "pending"
                        ? "bg-gray-400 dark:bg-gray-600"
                        : "bg-green-400 dark:bg-green-600"
                    }`}
                  >
                    {appliedJob.status.toUpperCase()}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AppliedJobTable;
