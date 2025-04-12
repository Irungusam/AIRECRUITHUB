import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { Readable } from "stream";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import nodemailer from "nodemailer";
import generateAvatar from "../utils/generateAvatar.js";


const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role } = req.body;

    if (!fullname || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    let profilePhoto;

    if (req.file) {
      const fileUri = getDataUri(req.file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      profilePhoto = cloudResponse.secure_url;
    } else {
      // Generate avatar from first letter
      const firstLetter = fullname.trim()[0].toUpperCase();
      const buffer = generateAvatar(firstLetter);

      // Convert buffer to stream and upload to Cloudinary
      const streamUpload = () =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "avatars" },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );
          Readable.from(buffer).pipe(stream);
        });

      const uploadResult = await streamUpload();
      profilePhoto = uploadResult.secure_url;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email.",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      isVerified: false,
      profile: {
        profilePhoto,
      },
    });

    const verificationToken = jwt.sign(
      { userId: user._id },
      process.env.EMAIL_VERIFICATION_SECRET,
      { expiresIn: "1d" }
    );

    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const verificationUrl = `${process.env.EMAIL_VERIFICATION_URL}?token=${verificationToken}`;
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: "Email Verification",
      html: `<p>Please verify your email:</p><a href="${verificationUrl}">${verificationUrl}</a>`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(201).json({
      message: "Account created successfully. Please verify your email.",
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};
const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Incorrect email or password.",
        success: false,
      });
    }

    // Check if the user's email is verified
    if (!user.isVerified) {
      return res.status(400).json({
        message: "Please verify your email before logging in.",
        success: false,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect email or password.",
        success: false,
      });
    }
    if (role !== user.role) {
      return res.status(400).json({
        message: "Account doesn't exist with current role.",
        success: false,
      });
    }

    const tokenData = {
      userId: user._id,
    };
    const token = jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        message: `Welcome back ${user.fullname}`,
        user,
        success: true,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    // Validate token existence
    if (!token) {
      return res.status(400).json({
        message: "Missing verification token",
        success: false,
      });
    }

    // Verify and decode JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.EMAIL_VERIFICATION_SECRET);
    } catch (jwtError) {
      // Return helpful error messages based on JWT error type
      if (jwtError.name === "TokenExpiredError") {
        return res.status(400).json({
          message: "Verification link has expired. Please request a new one.",
          success: false,
        });
      }

      return res.status(400).json({
        message: "Invalid verification token",
        success: false,
      });
    }

    // Find user by ID from token
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
    }

    // Check if user is already verified
    if (user.isVerified) {
      return res
        .status(200) // Changed from 400 to 200 to indicate this isn't truly an error
        .json({
          message: "User already verified",
          success: true, // Changed from false to true
          alreadyVerified: true,
        });
    }

    // Update user's verification status
    user.isVerified = true;
    await user.save();

    // On success, redirect to login page
    return res.status(200).json({
      message: "Email verification successful",
      success: true,
    });

    // Alternative: Direct redirect
    // return res.redirect("http://localhost:5173/login");
  } catch (error) {
    console.error("Email verification error:", error);
    return res.status(500).json({
      message: "Server error during verification",
      success: false,
    });
  }
};

const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

const updateProfile = async (req, res) => {
  try {
    const {
      fullname,
      email,
      phoneNumber,
      bio,
      professionalTitle,
      location,
      skills,
      jobPreferences,
      experience,
      education,
      certifications,
    } = req.body;

    let cloudResponse = null;
    let resumeOriginalName = null;

    // Handle optional file upload
    if (req.file) {
      const fileUri = getDataUri(req.file);
      cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      resumeOriginalName = req.file.originalname;
    }

    // Process arrays - handle both array and string formats
    const processArray = (input) => {
      if (Array.isArray(input)) {
        return input.map((item) => item.trim()).filter((item) => item !== "");
      } else if (typeof input === "string") {
        return input
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item !== "");
      }
      return [];
    };

    // Process skills
    let skillsArray = processArray(skills);
    let certificationsArray = processArray(certifications);

    // Parse JSON strings if needed
    const parseJsonField = (field) => {
      if (typeof field === "string") {
        try {
          return JSON.parse(field);
        } catch (error) {
          console.error("Error parsing JSON:", error);
          return null;
        }
      }
      return field;
    };

    // Parse job preferences, experience, and education if they're provided as strings
    const jobPrefsObj = parseJsonField(jobPreferences);
    const experienceArr = parseJsonField(experience);
    const educationArr = parseJsonField(education);

    const userId = req.id;
    let user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        message: "User not found.",
        success: false,
      });
    }

    // Initialize profile if it doesn't exist
    if (!user.profile) {
      user.profile = {};
    }

    // Update basic user fields if provided
    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;

    // Update profile fields if provided
    if (bio) user.profile.bio = bio;
    if (professionalTitle) user.profile.professionalTitle = professionalTitle;
    if (location) user.profile.location = location;
    if (skillsArray.length > 0) user.profile.skills = skillsArray;
    if (certificationsArray.length > 0)
      user.profile.certifications = certificationsArray;

    // Update job preferences if provided
    if (jobPrefsObj) {
      user.profile.jobPreferences = {
        ...(user.profile.jobPreferences || {}),
        ...jobPrefsObj,
      };
    }

    // Update experience if provided
    if (experienceArr && Array.isArray(experienceArr)) {
      user.profile.experience = experienceArr;
    }

    // Update education if provided
    if (educationArr && Array.isArray(educationArr)) {
      user.profile.education = educationArr;
    }

    // Update resume if a file was uploaded
    if (cloudResponse) {
      user.profile.resume = cloudResponse.secure_url;
      user.profile.resumeOriginalName = resumeOriginalName;
    }

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully.",
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        profile: user.profile,
      },
      success: true,
    });
  } catch (error) {
    console.error("Error updating profile:", error.message);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

const findUserById = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error(`User not found with id: ${userId}`);
    }
    return user;
  } catch (error) {
    console.error("Error finding user by ID:", error.message);
    throw new Error(error.message);
  }
};
const getUserIdFromToken = (token) => {
  const decodedToken = jwt.verify(token, SECRET_KEY, { algorithms: ["HS256"] });
  return decodedToken.userId;
};
const getUserProfile = async (req, res) => {
  try {
    const jwt = req.headers.authorization?.split(" ")[1];

    if (!jwt) {
      return res.status(404).send({ error: "token not found" });
    }
    const user = await getUserProfileByToken(jwt);

    return res.status(200).send(user);
  } catch (error) {
    console.log("error from controller - ", error);
    return res.status(500).send({ error: error.message });
  }
};
const getUserProfileByToken = async (token) => {
  try {
    const userId = getUserIdFromToken(token);

    console.log("User ID from token:", userId);

    const user = await User.findById(userId);
    if (!user) {
      throw new Error(`User does not exist with id: ${userId}`);
    }

    return user;
  } catch (error) {
    console.error("Error getting user profile by token:", error.message);
    throw new Error(error.message);
  }
};

const findOrCreateUserFromAuth0 = async (userData) => {
  try {
    // Extract relevant information from Auth0 user data
    const { sub, email, fullname, profilePhoto } = userData;

    // Validate required fields
    if (!sub || !email || !fullname) {
      console.error("Auth0 user data is missing required fields:", {
        sub,
        email,
        fullname,
      });
      throw new Error("Auth0 user data is missing required fields");
    }

    // Check if the user already exists by email
    let user = await User.findOne({ email });

    if (!user) {
      // User does not exist, so create a new one

      user = await User.create({
        auth0Id: sub,
        email,
        fullname, // Ensure this field is included
        profile: {
          profilePhoto: profilePhoto || "", // Add profilePhoto here if available
        },
        role: "student", // Default role for new users
      });
    } else {
      // User already exists, update the profile if necessary
      console.log("User already exists with email:", user.email);
      user.profile.profilePhoto = profilePhoto || user.profile.profilePhoto; // Update the profilePhoto if available
      user.fullname = fullname || user.fullname; // Update fullname if needed
      await user.save();
    }

    return user;
  } catch (error) {
    console.error("Error syncing Auth0 user:", error.message);
    throw new Error("Failed to sync user with Auth0");
  }
};

export default {
  register,
  login,
  logout,
  updateProfile,
  getUserProfile,
  findOrCreateUserFromAuth0,
  verifyEmail,
};
