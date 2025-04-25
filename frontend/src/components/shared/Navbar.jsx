import React, { useContext } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Avatar, AvatarImage } from "../ui/avatar";
import { LogOut, Moon, Sun, User2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";
import { toast } from "sonner";
import { ThemeContext } from "@/ThemeProvider";
import { useLocation } from "react-router-dom";
// import { IoIosNotifications } from "react-icons/io";
// import { FaBell } from "react-icons/fa6";
import { RiRobot2Fill } from "react-icons/ri";
const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext); // Access theme and toggle function

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(null));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error(
        error?.response?.data?.message || "Logout failed, please try again."
      );
    }
  };

  const avatarUrl =
    user?.profile?.profilePhoto ||
    user?._json?.picture ||
    "/default-avatar-url.jpg";

  const getLinkClass = (path) =>
    `text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition duration-300 ${
      location.pathname === path
        ? "text-blue-600 dark:text-blue-400 font-semibold border-b-2 border-blue-600 dark:border-blue-400"
        : ""
    }`;

  return (
    <div className="bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 dark:from-gray-800 dark:via-gray-900 dark:to-black border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex items-center justify-between mx-auto max-w-7xl h-16 px-6">
        <div>
          <Link to="/" className={getLinkClass("/")}>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-wide">
              <span className="text-red-700 dark:text-red-700">AI</span>
              <span className="text-gray-900 dark:text-gray-300">RECRUIT</span>
              <span className="text-red-700 dark:text-red-700">HUB</span>
            </h1>
          </Link>
        </div>

        <div className="flex items-center gap-12">
          <ul className="flex font-medium items-center gap-6">
            {user && user.role === "recruiter" ? (
              <>
                <li>
                  <Link
                    to="/admin/companies"
                    className={getLinkClass("/admin/companies")}
                  >
                    Companies
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/jobs"
                    className={getLinkClass("/admin/jobs")}
                  >
                    Jobs
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/resume-screen"
                    className={getLinkClass("/admin/resume-screen")}
                  >
                    Resume Screen
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/" className={getLinkClass("/")}>
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/jobs" className={getLinkClass("/jobs")}>
                    Jobs
                  </Link>
                </li>
                {/* <li>
                  <Link to="/browse" className={getLinkClass("/browse")}>
                    Browse
                  </Link>
                </li> */}
                <li>
                  <Link to="/JobAI" className={getLinkClass("/JobAI")}>
                    <div className="flex items-center gap-2">
                      <RiRobot2Fill
                        className={`text-2xl transition duration-300 ${
                          location.pathname === "/JobAI"
                            ? "text-blue-600 dark:text-blue-400"
                            : ""
                        }`}
                      />
                      <span>Chatbot</span>
                    </div>
                  </Link>
                </li>
              </>
            )}
          </ul>
          {!user ? (
            <div className="flex items-center gap-4">
              <Link to="/login">
                <Button
                  variant="outline"
                  className="rounded-full px-6 py-2 border-gray-300 dark:border-gray-500 text-gray-700 dark:text-gray-300 hover:border-gray-500 dark:hover:border-white hover:text-gray-900 dark:hover:text-white transition duration-300"
                >
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-700 text-gray-800 dark:text-white rounded-full px-6 py-2 transition duration-300">
                  Signup
                </Button>
              </Link>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="cursor-pointer border-2 border-gray-300 dark:border-gray-500 hover:border-gray-500 dark:hover:border-white transition duration-300">
                  <AvatarImage src={avatarUrl} alt="User Avatar" />
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="w-80 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex gap-3 items-center mb-3">
                  <Avatar className="cursor-pointer">
                    <AvatarImage src={avatarUrl} alt="User Avatar" />
                  </Avatar>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {user?.fullname}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {user?.profile?.bio}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col text-gray-600 dark:text-gray-400">
                  {user && user.role === "student" && (
                    <div className="flex items-center gap-2 mb-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-lg transition duration-200">
                      <User2 />
                      <Link to="/profile" className="no-underline">
                        <button
                          className={`text-gray-800 dark:text-white transition duration-300 focus:outline-none ${
                            location.pathname === "/profile"
                              ? "font-semibold text-blue-600 dark:text-blue-400"
                              : ""
                          }`}
                        >
                          View Profile
                        </button>
                      </Link>
                    </div>
                  )}

                  <div
                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-lg transition duration-200"
                    onClick={logoutHandler}
                  >
                    <LogOut />
                    <button className="text-gray-800 dark:text-white hover:text-red-600 dark:hover:text-red-400 transition duration-300 focus:outline-none no-underline">
                      Logout
                    </button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
          <Button
            variant="outline"
            onClick={toggleTheme}
            className="rounded-full px-3 py-2 border-gray-300 dark:border-gray-500 text-gray-700 dark:text-gray-300 hover:border-gray-500 dark:hover:border-white hover:text-gray-900 dark:hover:text-white transition duration-300"
          >
            {theme === "light" ? <Moon /> : <Sun />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
