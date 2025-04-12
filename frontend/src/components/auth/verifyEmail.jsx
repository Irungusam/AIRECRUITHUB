import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading"); // loading, success, error, missing, already-verified
  const [errorMessage, setErrorMessage] = useState("");
  const verificationAttempted = useRef(false);

  useEffect(() => {
    const token = new URLSearchParams(location.search).get("token");

    if (!token) {
      setStatus("missing");
      return;
    }

    const verifyEmailToken = async () => {
      // Skip if verification has already been attempted
      if (verificationAttempted.current) {
        return;
      }

      verificationAttempted.current = true;

      try {
        // Prevent axios from auto-following redirects
        const response = await axios.get(
          `http://localhost:8000/api/v1/user/verify-email?token=${token}`,
          {
            maxRedirects: 0,
            validateStatus: (status) => status < 500,
          }
        );

        // Server redirects on success
        if (response.status === 302 || response.status === 303) {
          setStatus("success");
          setTimeout(() => navigate("/login"), 2000);
          return;
        }

        // Handle the JSON response
        if (response.data) {
          if (response.data.success) {
            setStatus("success");
            setTimeout(() => navigate("/login"), 2000);
          } else if (
            response.data.message?.toLowerCase().includes("already verified")
          ) {
            setStatus("already-verified");
            setTimeout(() => navigate("/login"), 3000);
          } else {
            setStatus("error");
            setErrorMessage(response.data.message || "Verification failed.");
          }
        }
      } catch (error) {
        // Handle redirect (success case)
        if (error.response?.status === 302 || error.response?.status === 303) {
          setStatus("success");
          setTimeout(() => navigate("/login"), 2000);
          return;
        }

        // Handle already verified case
        if (
          error.response?.data?.message
            ?.toLowerCase()
            .includes("already verified")
        ) {
          setStatus("already-verified");
          setTimeout(() => navigate("/login"), 3000);
          return;
        }

        // Handle other errors
        console.error("Verification error:", error);
        setStatus("error");
        setErrorMessage(
          error.response?.data?.message ||
            "Verification failed. Your token might be expired or invalid."
        );
      }
    };

    verifyEmailToken();
  }, [location.search, navigate]);

  // Render functions for each state
  const renderLoading = () => (
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-600">Verifying your email address...</p>
    </div>
  );

  const renderSuccess = () => (
    <div className="flex flex-col items-center gap-4">
      <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-green-600">
        Email Verified Successfully!
      </h2>
      <p className="text-gray-600">
        You will be redirected to login page in a moment...
      </p>
    </div>
  );

  const renderAlreadyVerified = () => (
    <div className="flex flex-col items-center gap-4">
      <div className="w-16 h-16 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-blue-600">Already Verified</h2>
      <p className="text-gray-600">Your email has already been verified.</p>
      <p className="text-gray-600">
        You will be redirected to login page in a moment...
      </p>
    </div>
  );

  const renderError = () => (
    <div className="flex flex-col items-center gap-4">
      <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-red-600">
        Verification Failed
      </h2>
      <p className="text-gray-600">{errorMessage}</p>
      <button
        onClick={() => navigate("/login")}
        className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        Go to Login
      </button>
    </div>
  );

  const renderMissingToken = () => (
    <div className="flex flex-col items-center gap-4">
      <div className="w-16 h-16 bg-yellow-100 text-yellow-500 rounded-full flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-yellow-600">
        Missing Verification Token
      </h2>
      <p className="text-gray-600">
        No verification token was found in the URL.
      </p>
      <button
        onClick={() => navigate("/login")}
        className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        Go to Login
      </button>
    </div>
  );

  // Render content based on status
  const renderContent = () => {
    switch (status) {
      case "loading":
        return renderLoading();
      case "success":
        return renderSuccess();
      case "already-verified":
        return renderAlreadyVerified();
      case "error":
        return renderError();
      case "missing":
        return renderMissingToken();
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-6">Email Verification</h1>
        {renderContent()}
      </div>
    </div>
  );
};

export default VerifyEmail;
