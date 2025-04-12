import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";

const filterData = [
  {
    filterType: "location",
    options: ["Nairobi", "Mombasa", "Kisumu", "Nakuru"],
  },
  {
    filterType: "job type",
    options: [
      "Full-time",
      "Part-time",
      "Contract",
      "Freelance",
      "On-site",
      "Remote",
      "Hybrid",
    ],
  },
  {
    filterType: "salary",
    options: ["Ksh50000-Ksh100000", "Ksh100001-Ksh150000", "above Ksh150000"],
  },
];

const FilterCard = () => {
  const dispatch = useDispatch();
  const { searchedQuery } = useSelector((store) => store.job);

  const handleFilterChange = (value) => {
    const newFilters = searchedQuery.includes(value)
      ? searchedQuery.filter((item) => item !== value)
      : [...searchedQuery, value];

    dispatch(setSearchedQuery(newFilters));
  };

  const clearAllFilters = () => {
    dispatch(setSearchedQuery([]));
  };

  return (
    <div className="w-full bg-white dark:bg-gray-800 p-4 rounded-md border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h1 className="font-bold text-xl text-gray-800 dark:text-gray-100">
          Filter Jobs
        </h1>
        {searchedQuery.length > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
          >
            Clear All
          </button>
        )}
      </div>
      <hr className="mb-4 border-gray-300 dark:border-gray-600" />
      <div>
        {filterData.map((filterGroup, index) => (
          <div key={index} className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold text-lg text-gray-800 dark:text-gray-200">
                {filterGroup.filterType.charAt(0).toUpperCase() +
                  filterGroup.filterType.slice(1)}
              </h2>
              {searchedQuery.some((query) =>
                filterGroup.options.includes(query)
              ) && (
                <button
                  onClick={() => {
                    const newFilters = searchedQuery.filter(
                      (item) => !filterGroup.options.includes(item)
                    );
                    dispatch(setSearchedQuery(newFilters));
                  }}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                  Clear
                </button>
              )}
            </div>
            {filterGroup.options.map((option, idx) => {
              const optionId = `filter-${index}-${idx}`;
              return (
                <div
                  className="flex items-center space-x-3 mb-2"
                  key={optionId}
                >
                  <input
                    type="checkbox"
                    id={optionId}
                    value={option}
                    checked={searchedQuery.includes(option)}
                    onChange={() => handleFilterChange(option)}
                    className="form-checkbox h-5 w-5 text-blue-600 dark:text-blue-400 rounded focus:ring focus:ring-offset-0 focus:ring-blue-300 dark:focus:ring-blue-600"
                  />
                  <label
                    htmlFor={optionId}
                    className="text-sm text-gray-800 dark:text-gray-300"
                  >
                    {option}
                  </label>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterCard;
