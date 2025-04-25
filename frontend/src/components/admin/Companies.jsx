import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import debounce from "lodash/debounce";

// Components
import Navbar from "../shared/Navbar";
import CompaniesTable from "./CompaniesTable";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";

// Hooks and State
import useGetAllCompanies from "@/hooks/useGetAllCompanies";
import { setSearchCompanyByText } from "@/redux/companySlice";

const Companies = () => {
  // Call the hook without destructuring since it appears to not return an object
  useGetAllCompanies();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Debounce search to improve performance
  const debouncedSearch = useCallback(
    debounce((value) => {
      dispatch(setSearchCompanyByText(value));
    }, 300),
    [dispatch]
  );
  

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const handleCreateCompany = () => navigate("/admin/companies/create");

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 bg-white dark:bg-gray-800 shadow-sm rounded-lg p-4">
          <div className="relative w-full sm:w-1/2">
            <Input
              type="search"
              placeholder="Search companies by name..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-4 pr-8 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  dispatch(setSearchCompanyByText(""));
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                
              </button>
            )}
          </div>
          <Button
            onClick={handleCreateCompany}
            className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors dark:bg-blue-500 dark:hover:bg-blue-600 flex items-center justify-center gap-2"
          >
            <Plus size={16} />
            <span>New Company</span>
          </Button>
        </div>

        <section className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
          <CompaniesTable />
        </section>
      </main>
    </div>
  );
};

export default Companies;
