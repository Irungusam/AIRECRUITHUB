import React, { useCallback } from "react";
import { Button } from "./ui/button";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSearchedQuery } from "@/redux/jobSlice";

const categories = [
  "Frontend Developer",
  "Backend Developer",
  "FullStack Developer",
  "Data Science",
  "Graphic Designer",
  "Mobile App Developer",
  "DevOps Engineer",
  "Cloud Engineer",
  "AI/ML Engineer",
];

const CategoryGrid = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchJobHandler = useCallback(
    (query) => {
      dispatch(setSearchedQuery([query]));
      navigate("/browse");
    },
    [dispatch, navigate]
  );

  return (
    <div className="max-w-2xl mx-auto my-16 px-6">
      <h2 className="text-2xl font-semibold text-center mb-6">
        Explore Job Categories
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {categories.map((category) => (
          <Button
            key={category}
            onClick={() => searchJobHandler(category)}
            variant="outline"
            className="w-full py-3 text-lg font-medium transition-colors 
           bg-gray-100 text-gray-800 border border-gray-300 
           hover:bg-primary hover:text-white 
           dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 
           dark:hover:bg-primary dark:hover:text-gray-900"
          >
            {category}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CategoryGrid;
