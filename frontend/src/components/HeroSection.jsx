
import React, { useState } from "react";
// import { Button } from "./ui/button";
// import { Search } from "lucide-react";
import { useDispatch } from "react-redux";
// import { setSearchedQuery } from "@/redux/jobSlice";
import { useNavigate } from "react-router-dom";
const HeroSection = () => {
  // const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const searchJobHandler = () => {
  //   dispatch(setSearchedQuery([query]));
  //   navigate("/jobs");
  // };

  return (
    <div className="text-left">
      <div className="flex flex-col gap-5 my-10">
        <h1
          className="text-5xl font-bold ml-40 font-Montserrat text-gray-900 dark:text-white"
          style={{ fontFamily: "Montserrat" }}
        >
          THE FUTURE OF
          <br />
          <span className="text-[#FF0000]">RECRUITMENT</span> <br />
          POWERED BY AI
        </h1>
        {/* <div className="flex w-[60%] shadow-lg border border-gray-300 dark:border-gray-600 rounded-full items-center gap-4 mx-auto bg-white dark:bg-gray-800">
          <input
            type="text"
            placeholder="Find your dream jobs"
            onChange={(e) => setQuery(e.target.value)}
            className="outline-none text-gray-900 dark:text-gray-200 border-none w-full bg-transparent text-base py-2 pl-4"
          />
          <Button
            onClick={searchJobHandler}
            className="rounded-r-full bg-white dark:bg-gray-800 text-base px-5 py-2 h-full flex items-center justify-center"
          >
            <Search className="h-5 w-5 text-black dark:text-gray-200" />
          </Button>
        </div> */}
      </div>
    </div>
  );
};

export default HeroSection;
