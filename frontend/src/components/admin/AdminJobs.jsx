import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { debounce } from "lodash";

// Components
import Navbar from "../shared/Navbar";
import AdminJobsTable from "./AdminJobsTable";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";

// Hooks & State
import useGetAllAdminJobs from "@/hooks/useGetAllAdminJobs";
import { setSearchJobByText } from "@/redux/jobSlice";

const AdminJobs = () => {
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Fetch all jobs on component mount - keep as original implementation
  useGetAllAdminJobs();

  // Create memoized debounced search function
  const debouncedSearch = useMemo(
    () =>
      debounce((searchText) => {
        dispatch(setSearchJobByText(searchText));
      }, 500),
    [dispatch]
  );

  // Handle search input changes
  useEffect(() => {
    debouncedSearch(searchInput);

    // Clean up debounced function on unmount
    return () => debouncedSearch.cancel();
  }, [searchInput, debouncedSearch]);

  // Navigate to job creation page
  const handleCreateJob = () => navigate("/admin/jobs/create");

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Job Management
          </h1>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-full sm:w-80">
              <Input
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Search by job title or company"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                aria-label="Search for jobs"
                data-testid="job-search-input"
              />
            </div>

            <Button
              onClick={handleCreateJob}
              className="w-full sm:w-auto px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 flex items-center justify-center gap-2"
              aria-label="Create new job"
              data-testid="create-job-button"
            >
              <Plus size={16} />
              <span>New Job</span>
            </Button>
          </div>
        </div>

        <AdminJobsTable />
      </main>
    </div>
  );
};

export default AdminJobs;
