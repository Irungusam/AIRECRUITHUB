import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import debounce from "lodash/debounce";

import Navbar from "./shared/Navbar";
import FilterCard from "./FilterCard";
import Job from "./Job";
import { Button } from "./ui/button";
import {
  setSearchJobByText,
  setSearchedQuery,
  clearFilters,
} from "@/redux/jobSlice";

const Jobs = () => {
  const { allJobs, searchJobByText, searchedQuery } = useSelector(
    (store) => store.job
  );
  const [localQuery, setLocalQuery] = useState(searchJobByText);
  const dispatch = useDispatch();

  // Define our filter categories
  const locationOptions = ["Nairobi", "Mombasa", "Kisumu", "Nakuru"];
  const jobTypeOptions = [
    "Full-time",
    "Part-time",
    "Contract",
    "Freelance",
    "On-site",
    "Remote",
    "Hybrid",
  ];
  const salaryOptions = [
    "Ksh20,000-Ksh50,000",
    "Ksh50,000-Ksh100,000",
    "Ksh100,000-Ksh200,000",
    "above Ksh200,000",
  ];

  // Separate current filters by type
  const currentFilters = useMemo(() => {
    const locationFilters = searchedQuery.filter((item) =>
      locationOptions.includes(item)
    );
    const jobTypeFilters = searchedQuery.filter((item) =>
      jobTypeOptions.includes(item)
    );
    const salaryFilters = searchedQuery.filter((item) =>
      salaryOptions.includes(item)
    );
    const categoryFilters = searchedQuery.filter(
      (item) =>
        !locationOptions.includes(item) &&
        !jobTypeOptions.includes(item) &&
        !salaryOptions.includes(item)
    );

    return {
      locations: locationFilters,
      jobTypes: jobTypeFilters,
      salaries: salaryFilters,
      categories: categoryFilters,
    };
  }, [searchedQuery]);

  // Filter jobs based on all criteria
  const filteredJobs = useMemo(() => {
    // If no filters or search, return all jobs
    if (!searchJobByText && searchedQuery.length === 0) return allJobs;

    return allJobs.filter((job) => {
      // 1. Text search (works across multiple fields)
      const matchesSearch =
        !searchJobByText ||
        [job.title, job.description, job.location, job.company?.name].some(
          (field) =>
            field?.toLowerCase().includes(searchJobByText.toLowerCase())
        );

      // 2. Location filter
      const matchesLocation =
        currentFilters.locations.length === 0 ||
        currentFilters.locations.some(
          (filter) => job.location?.toLowerCase() === filter.toLowerCase()
        );

      // 3. Job Type filter
      const matchesJobType =
        currentFilters.jobTypes.length === 0 ||
        currentFilters.jobTypes.some((filter) => {
          const lowerFilter = filter.toLowerCase();
          return (
            (job.jobType && job.jobType.toLowerCase().includes(lowerFilter)) ||
            (job.workMode && job.workMode.toLowerCase().includes(lowerFilter))
          );
        });

      // 4. Salary filter
      const matchesSalary =
        currentFilters.salaries.length === 0 ||
        currentFilters.salaries.some((range) => {
          const jobSalary = parseFloat(job.salary) || 0;
          if (range.startsWith("above")) {
            const min = parseFloat(range.match(/\d+/g)[0]);
            return jobSalary >= min;
          } else {
            const [min, max] = range.match(/\d+/g).map(Number);
            return jobSalary >= min && jobSalary <= max;
          }
        });

      // 5. Category filter
      const matchesCategory =
        currentFilters.categories.length === 0 ||
        currentFilters.categories.some((category) => {
          const lowerCategory = category.toLowerCase();
          return (
            job.title.toLowerCase().includes(lowerCategory) ||
            (job.category &&
              job.category.toLowerCase().includes(lowerCategory)) ||
            (job.description &&
              job.description.toLowerCase().includes(lowerCategory))
          );
        });

      return (
        matchesSearch &&
        matchesLocation &&
        matchesJobType &&
        matchesSalary &&
        matchesCategory
      );
    });
  }, [allJobs, searchJobByText, searchedQuery, currentFilters]);

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

  const handleClearFilters = () => {
    dispatch(clearFilters());
    setLocalQuery("");
  };

  const removeFilter = (filterToRemove) => {
    const newFilters = searchedQuery.filter(
      (filter) => filter !== filterToRemove
    );
    dispatch(setSearchedQuery(newFilters));
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

        {/* Active filters */}
        {searchedQuery.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2 items-center">
            <span className="text-sm font-medium">Active filters:</span>
            {searchedQuery.map((filter) => (
              <span
                key={filter}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              >
                {filter}
                <button
                  type="button"
                  onClick={() => removeFilter(filter)}
                  className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500 dark:hover:bg-blue-800 dark:hover:text-blue-300"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            >
              Clear all
            </Button>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-5">
          <aside className="hidden lg:block lg:w-1/4">
            <FilterCard />
          </aside>

          <section className="flex-1">
            {filteredJobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64">
                <p className="text-xl text-gray-500 mb-4">
                  No jobs found matching your criteria.
                </p>
                <Button variant="outline" onClick={handleClearFilters}>
                  Clear filters
                </Button>
              </div>
            ) : (
              <>
                <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                  Showing {filteredJobs.length}{" "}
                  {filteredJobs.length === 1 ? "job" : "jobs"}
                </div>
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
              </>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default Jobs;
