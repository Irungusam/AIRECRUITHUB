import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import debounce from "lodash/debounce";

import Navbar from "./shared/Navbar";
import FilterCard from "./FilterCard";
import Job from "./Job";
import { Button } from "./ui/button";
import { setSearchJobByText, setSearchedQuery } from "@/redux/jobSlice";

const Jobs = () => {
  const { allJobs, searchJobByText, searchedQuery } = useSelector(
    (store) => store.job
  );
  const [localQuery, setLocalQuery] = useState(searchJobByText);
  const dispatch = useDispatch();

  const filteredJobs = useMemo(() => {
    // If no filters or search, return all jobs
    if (!searchJobByText && searchedQuery.length === 0) return allJobs;

    // Separate filters by type
    const locationFilters = searchedQuery.filter((item) =>
      ["Nairobi", "Mombasa", "Kisumu", "Nakuru"].includes(item)
    );

    const jobTypeFilters = searchedQuery.filter((item) =>
      [
        "Full-time",
        "Part-time",
        "Contract",
        "Freelance",
        "On-site",
        "Remote",
        "Hybrid",
      ].includes(item)
    );

    const salaryFilters = searchedQuery.filter(
      (item) => item.startsWith("Ksh") || item.startsWith("above")
    );

    return allJobs.filter((job) => {
      // 1. Text search (works across multiple fields)
      const matchesSearch =
        !searchJobByText ||
        [job.title, job.description, job.location, job.company?.name].some(
          (field) =>
            field?.toLowerCase().includes(searchJobByText.toLowerCase())
        );

      // 2. Location filter (exact match)
      const matchesLocation =
        locationFilters.length === 0 ||
        locationFilters.some(
          (filter) => job.location?.toLowerCase() === filter.toLowerCase()
        );

      // 3. Job Type filter
      const matchesJobType =
        jobTypeFilters.length === 0 ||
        jobTypeFilters.some((filter) => {
          const lowerFilter = filter.toLowerCase();
          return (
            (job.jobType && job.jobType.toLowerCase().includes(lowerFilter)) ||
            (job.workMode && job.workMode.toLowerCase().includes(lowerFilter))
          );
        });

      // 4. Salary filter
      const matchesSalary =
        salaryFilters.length === 0 ||
        salaryFilters.some((range) => {
          const jobSalary = parseFloat(job.salary) || 0;
          if (range.startsWith("above")) {
            const min = parseFloat(range.match(/\d+/g)[0]);
            return jobSalary >= min;
          } else {
            const [min, max] = range.match(/\d+/g).map(Number);
            return jobSalary >= min && jobSalary <= max;
          }
        });

      return (
        matchesSearch && matchesLocation && matchesJobType && matchesSalary
      );
    });
  }, [allJobs, searchJobByText, searchedQuery]);

  // Debounced search handler
  const debouncedSearch = useMemo(
    () => debounce((text) => dispatch(setSearchJobByText(text)), 300),
    [dispatch]
  );

  useEffect(() => {
    return () => debouncedSearch.cancel();
  }, [debouncedSearch]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setLocalQuery(value);
    debouncedSearch(value);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 mt-5">
        {/* Search bar */}
        <div className="flex justify-center mb-6">
          <div className="flex w-full md:w-4/5 lg:w-3/4 shadow-lg border border-gray-300 dark:border-gray-600 rounded-full items-center gap-4 bg-white dark:bg-gray-800">
            <input
              type="search"
              placeholder="Search for jobs..."
              value={localQuery}
              onChange={handleInputChange}
              className="outline-none text-gray-900 dark:text-gray-200 border-none w-full bg-transparent text-base py-3 pl-6"
            />
            <Button
              onClick={() => debouncedSearch.flush()}
              className="rounded-r-full"
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-5">
          <aside className="hidden lg:block lg:w-1/4">
            <FilterCard />
          </aside>

          <section className="flex-1">
            {filteredJobs.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <p className="text-xl text-gray-500">
                  No jobs found matching your criteria.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                <AnimatePresence>
                  {filteredJobs.map((job) => (
                    <motion.div
                      key={job._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Job job={job} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default Jobs;
