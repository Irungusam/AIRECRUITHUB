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
import { Avatar, AvatarImage } from "../ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Edit2, MoreHorizontal, Trash2 } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { COMPANY_API_END_POINT } from "@/utils/constant";
import { removeCompany } from "../../redux/companySlice";
import { toast } from "sonner";

const CompaniesTable = () => {
  const { companies, searchCompanyByText } = useSelector(
    (store) => store.company
  );
  const [filterCompany, setFilterCompany] = useState(companies);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const filteredCompany = companies.filter((company) => {
      if (!searchCompanyByText) {
        return true;
      }
      return company?.name
        ?.toLowerCase()
        .includes(searchCompanyByText.toLowerCase());
    });
    setFilterCompany(filteredCompany);
  }, [companies, searchCompanyByText]);

  const handleDeleteCompany = async (companyId) => {
    try {
      const res = await axios.delete(
        `${COMPANY_API_END_POINT}/delete/${companyId}`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.success) {
        dispatch(removeCompany(companyId));
        toast.success("Company deleted successfully", {
          description: "The company and all associated jobs have been removed.",
          action: {
            label: "Close",
            onClick: () => {},
          },
        });
      } else {
        toast.error("Failed to delete company", {
          description: res.data.message || "Please try again later.",
        });
      }
    } catch (error) {
      console.error("Error deleting company:", error);

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
          onClick: () => handleDeleteCompany(companyId),
        },
      });
    }
  };

  return (
    <div className="overflow-x-auto bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
      <Table className="text-gray-800 dark:text-gray-300">
        <TableCaption className="text-gray-700 dark:text-gray-400">
          A list of your recent registered companies
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="text-gray-700 dark:text-gray-300">
              Logo
            </TableHead>
            <TableHead className="text-gray-700 dark:text-gray-300">
              Name
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
          {filterCompany.map((company) => (
            <TableRow
              key={company._id}
              className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
            >
              <TableCell>
                <Avatar className="w-12 h-12">
                  <AvatarImage
                    src={company.logo || "default-avatar.png"}
                    alt={company.name}
                    className="rounded-full object-cover"
                  />
                </Avatar>
              </TableCell>
              <TableCell className="text-gray-900 dark:text-gray-300">
                {company.name}
              </TableCell>
              <TableCell className="text-gray-500 dark:text-gray-400">
                {company.createdAt.split("T")[0]}
              </TableCell>
              <TableCell className="text-right cursor-pointer">
                <Popover>
                  <PopoverTrigger>
                    <MoreHorizontal className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-400 transition-all" />
                  </PopoverTrigger>
                  <PopoverContent className="w-40 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-300">
                    <div
                      onClick={() =>
                        navigate(`/admin/companies/${company._id}`)
                      }
                      className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md"
                    >
                      <Edit2 className="w-4 h-4 text-gray-500 dark:text-gray-300" />
                      <span>Edit</span>
                    </div>
                    <div
                      onClick={() => {
                        toast("Deleting company", {
                          description:
                            "This will also delete all associated jobs. Are you sure?",
                          action: {
                            label: "Confirm",
                            onClick: () => handleDeleteCompany(company._id),
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

export default CompaniesTable;
