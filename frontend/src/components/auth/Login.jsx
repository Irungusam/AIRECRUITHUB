import React, { useEffect, useState } from "react";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "@/redux/authSlice";
import {
  Loader2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  User,
} from "lucide-react";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
    role: "student", // Default role
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { loading, user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!input.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(input.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!input.password) {
      newErrors.password = "Password is required";
    }

    if (!input.role) {
      newErrors.role = "Please select a role";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });

    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleGoogleAuth = () => {
    dispatch(setLoading(true));
    try {
      window.location.href = `${USER_API_END_POINT}/auth0/login`;
    } catch (error) {
      console.error("Google login failed:", error);
      toast.error("Google login failed. Please try again.");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (res.data.success) {
        // Save to local storage if remember me is checked
        if (rememberMe) {
          localStorage.setItem("email", input.email);
          localStorage.setItem("role", input.role);
        } else {
          localStorage.removeItem("email");
          localStorage.removeItem("role");
        }

        dispatch(setUser(res.data.user));
        toast.success(res.data.message || "Login successful!");
        navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Login failed. Please check your credentials.";
      toast.error(errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Check for saved credentials on component mount
  useEffect(() => {
    const savedEmail = localStorage.getItem("email");
    const savedRole = localStorage.getItem("role");

    if (savedEmail) {
      setInput((prev) => ({
        ...prev,
        email: savedEmail,
        role: savedRole || prev.role,
      }));
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Handle back to home navigation
  const handleBackToHome = (e) => {
    e.stopPropagation(); // Stop event propagation
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex w-full max-w-5xl shadow-xl rounded-2xl overflow-hidden">
        {/* Left side with Image */}
        <div className="relative hidden md:block w-1/2 bg-indigo-600">
          <div className="absolute top-4 left-4 z-10">
            <h2 className="text-2xl text-white font-bold">
              AI<span className="text-[#d4363e]">RECRUITHUB</span>
            </h2>
          </div>

          {/* Fixed Back to Home button with higher z-index and better positioning */}
          <div className="absolute top-4 right-4 z-20">
            <Button
              variant="ghost"
              onClick={handleBackToHome}
              className="text-white bg-[#6B6B6B] bg-opacity-20 hover:bg-opacity-30 rounded-md px-4 py-2"
              type="button"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
            </Button>
          </div>

          <div className="relative h-full">
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-indigo-900/70 z-10"></div>
            <img
              src="/src/assets/login.jpg"
              alt="Professional networking"
              className="object-cover w-full h-full"
            />
            <div className="absolute bottom-10 left-10 z-10 text-white">
              <h3 className="text-2xl font-bold mb-2">Welcome Back</h3>
              <p className="text-indigo-100 max-w-xs">
                Sign in to access your account and continue your professional
                journey.
              </p>
            </div>
          </div>
        </div>

        {/* Right side with Form */}
        <div className="w-full md:w-1/2 p-6 md:p-10 bg-white">
          <div className="md:hidden flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">
              AI<span className="text-indigo-600">RECRUITHUB</span>
            </h2>
            <Button
              variant="ghost"
              onClick={handleBackToHome}
              className="text-indigo-600"
              type="button"
            >
              <ArrowLeft className="mr-1 h-4 w-4" /> Back
            </Button>
          </div>

          <form onSubmit={submitHandler} className="space-y-6">
            <div className="text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Sign In
              </h1>
              <p className="text-gray-500 mt-1">
                Welcome back! Please enter your details
              </p>
            </div>

            <div className="space-y-4">
              {/* Email Input */}
              <div>
                <Label
                  htmlFor="email"
                  className="text-gray-700 font-medium block mb-1"
                >
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={input.email}
                    name="email"
                    onChange={changeEventHandler}
                    placeholder="you@example.com"
                    className={`pl-10 bg-gray-50 border ${
                      errors.email ? "border-red-300" : "border-gray-200"
                    } focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500`}
                    aria-invalid={errors.email ? "true" : "false"}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label
                    htmlFor="password"
                    className="text-gray-700 font-medium"
                  >
                    Password
                  </Label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-indigo-600 hover:text-indigo-800"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={input.password}
                    name="password"
                    onChange={changeEventHandler}
                    placeholder="••••••••"
                    className={`pl-10 pr-10 bg-gray-50 border ${
                      errors.password ? "border-red-300" : "border-gray-200"
                    } focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500`}
                    aria-invalid={errors.password ? "true" : "false"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              {/* Role Selection */}
              <div>
                <Label className="text-gray-700 font-medium block mb-2">
                  I am a:
                </Label>
                <RadioGroup
                  value={input.role}
                  className="flex flex-wrap gap-4"
                  onValueChange={(value) => setInput({ ...input, role: value })}
                >
                  <div
                    className={`flex-1 min-w-[120px] border rounded-lg p-4 cursor-pointer transition-all ${
                      input.role === "student"
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <RadioGroupItem
                      value="student"
                      id="student-login"
                      className="sr-only"
                    />
                    <Label
                      htmlFor="student-login"
                      className="flex flex-col items-center cursor-pointer"
                    >
                      <span className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mb-2">
                        <User className="h-5 w-5 text-indigo-600" />
                      </span>
                      <span className="font-medium text-gray-800">
                        Job Seeker
                      </span>
                    </Label>
                  </div>

                  <div
                    className={`flex-1 min-w-[120px] border rounded-lg p-4 cursor-pointer transition-all ${
                      input.role === "recruiter"
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <RadioGroupItem
                      value="recruiter"
                      id="recruiter-login"
                      className="sr-only"
                    />
                    <Label
                      htmlFor="recruiter-login"
                      className="flex flex-col items-center cursor-pointer"
                    >
                      <span className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mb-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-indigo-600"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                        </svg>
                      </span>
                      <span className="font-medium text-gray-800">
                        Recruiter
                      </span>
                    </Label>
                  </div>
                </RadioGroup>
                {errors.role && (
                  <p className="text-red-500 text-xs mt-1">{errors.role}</p>
                )}
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700 cursor-pointer"
                >
                  Remember me
                </label>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="space-y-3 pt-2">
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 transition-colors"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing
                    in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>

              <div className="relative py-3">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-4 text-sm text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <Button
                type="button"
                onClick={handleGoogleAuth}
                disabled={loading}
                className="w-full bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 py-2 flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign in with Google
              </Button>
            </div>

            <div className="text-center text-sm text-gray-600 mt-6">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Sign up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
