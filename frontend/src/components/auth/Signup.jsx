import React, { useEffect, useState } from "react";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/redux/authSlice";
import {
  Loader2,
  Eye,
  EyeOff,
  User,
  Mail,
  Phone,
  Lock,
  Upload,
  ArrowLeft,
} from "lucide-react";

const Signup = () => {
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "student", // Default role
    file: null,
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [fileName, setFileName] = useState("");

  const { loading, user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!input.fullname.trim()) newErrors.fullname = "Full name is required";

    if (!input.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(input.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!input.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^\d{10}$/.test(input.phoneNumber.replace(/\D/g, ""))) {
      newErrors.phoneNumber = "Phone number should be 10 digits";
    }

    if (!input.password) {
      newErrors.password = "Password is required";
    } else if (input.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!input.role) newErrors.role = "Please select a role";

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

  const changeFileHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setInput({ ...input, file });
      setFileName(file.name);
    }
  };

  const handleGoogleAuth = () => {
    dispatch(setLoading(true));
    try {
      window.location.href = `${USER_API_END_POINT}/auth0/login`;
    } catch (error) {
      toast.error("Google login failed. Please try again.");
      console.error("Google login failed:", error);
      dispatch(setLoading(false));
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("fullname", input.fullname.trim());
    formData.append("email", input.email.trim());
    formData.append("phoneNumber", input.phoneNumber.trim());
    formData.append("password", input.password);
    formData.append("role", input.role);
    if (input.file) {
      formData.append("file", input.file);
    }

    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success(
          "Registration successful! Please check your email to verify your account."
        );
        navigate("/login");
      }
    } catch (error) {
      console.error("Registration error:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Registration failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  };

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
              AI<span className="text-indigo-200">RECRUITHUB</span>
            </h2>
          </div>

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
              src="/src/assets/signuppage.jpg"
              alt="Recruitment professionals"
              className="object-cover w-full h-full"
            />
            <div className="absolute bottom-10 left-10 z-20 text-white">
              <h3 className="text-2xl font-bold mb-2">Start Your Journey</h3>
              <p className="text-indigo-100 max-w-xs">
                Join our platform to connect with top employers and find your
                dream job opportunity.
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
              onClick={() => navigate("/")}
              className="text-indigo-600"
            >
              <ArrowLeft className="mr-1 h-4 w-4" /> Back
            </Button>
          </div>

          <form onSubmit={submitHandler} className="space-y-5">
            <div className="text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Create Account
              </h1>
              <p className="text-gray-500 mt-1">
                Join our community and start your journey
              </p>
            </div>

            <div className="space-y-4">
              {/* Full Name Input */}
              <div>
                <Label
                  htmlFor="fullname"
                  className="text-gray-700 font-medium block mb-1"
                >
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="fullname"
                    type="text"
                    value={input.fullname}
                    name="fullname"
                    onChange={changeEventHandler}
                    placeholder="John Doe"
                    className={`pl-10 ${
                      errors.fullname ? "border-red-300" : ""
                    }`}
                    aria-invalid={errors.fullname ? "true" : "false"}
                  />
                </div>
                {errors.fullname && (
                  <p className="text-red-500 text-xs mt-1">{errors.fullname}</p>
                )}
              </div>

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
                    className={`pl-10 ${errors.email ? "border-red-300" : ""}`}
                    aria-invalid={errors.email ? "true" : "false"}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              {/* Phone Number Input */}
              <div>
                <Label
                  htmlFor="phoneNumber"
                  className="text-gray-700 font-medium block mb-1"
                >
                  Phone Number
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="phoneNumber"
                    type="tel"
                    value={input.phoneNumber}
                    name="phoneNumber"
                    onChange={changeEventHandler}
                    placeholder="0712345678"
                    className={`pl-10 ${
                      errors.phoneNumber ? "border-red-300" : ""
                    }`}
                    aria-invalid={errors.phoneNumber ? "true" : "false"}
                  />
                </div>
                {errors.phoneNumber && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.phoneNumber}
                  </p>
                )}
              </div>

              {/* Password Input */}
              <div>
                <Label
                  htmlFor="password"
                  className="text-gray-700 font-medium block mb-1"
                >
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={input.password}
                    name="password"
                    onChange={changeEventHandler}
                    placeholder="••••••••"
                    className={`pl-10 pr-10 ${
                      errors.password ? "border-red-300" : ""
                    }`}
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
                {!errors.password && (
                  <p className="text-gray-500 text-xs mt-1">
                    Password must be at least 8 characters
                  </p>
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
                      id="student"
                      className="sr-only"
                    />
                    <Label
                      htmlFor="student"
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
                      id="recruiter"
                      className="sr-only"
                    />
                    <Label
                      htmlFor="recruiter"
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

              {/* Profile Picture Upload */}
              <div>
                <Label
                  htmlFor="file"
                  className="text-gray-700 font-medium block mb-1"
                >
                  Profile Picture (Optional)
                </Label>
                <div className="relative">
                  <Input
                    id="file"
                    accept="image/*"
                    type="file"
                    onChange={changeFileHandler}
                    className="hidden"
                  />
                  <div className="flex items-center">
                    <Label
                      htmlFor="file"
                      className="flex items-center px-4 py-2 bg-gray-50 border border-gray-200 rounded-l-md hover:bg-gray-100 cursor-pointer"
                    >
                      <Upload className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-sm text-gray-700">Choose file</span>
                    </Label>
                    <div className="flex-1 px-3 py-2 border border-l-0 border-gray-200 rounded-r-md bg-white text-sm text-gray-500 truncate">
                      {fileName || "No file chosen"}
                    </div>
                  </div>
                </div>
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
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating
                    Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>

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
                Continue with Google
              </Button>
            </div>

            <div className="text-center text-sm text-gray-600 mt-6">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
