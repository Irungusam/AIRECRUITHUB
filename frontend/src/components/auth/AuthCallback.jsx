
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUser, setLoading } from '../../redux/authSlice';
import { toast } from 'sonner';

const AuthCallback = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        
      const fetchUser = async () => {
        dispatch(setLoading(true));
        try {
          const response = await fetch(
            "http://localhost:8000/api/v1/user/profile",
            {
              method: "GET",
              credentials: "include", // This is correct
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          console.log("Response status:", response.status);

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Failed to fetch user data");
          }

          const userData = await response.json();
          console.log("User data received:", userData);

          // Ensure profile photo exists
          const profilePhoto =
            userData.profile?.profilePhoto ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              userData.fullname
            )}`;

          // Update Redux state
          dispatch(
            setUser({
              ...userData,
              profile: {
                ...userData.profile,
                profilePhoto,
              },
            })
          );

          toast.success("Login successful!");
          // Use navigate instead of window.location to maintain React state
          navigate("/");
        } catch (error) {
          console.error("Authentication error:", error);
          toast.error(
            error.message || "Authentication failed. Please try again."
          );
          navigate("/login");
        } finally {
          dispatch(setLoading(false));
        }
      };
    
      
        fetchUser();
    }, [dispatch, navigate]);

    return <div>Loading...</div>;
};

export default AuthCallback;

