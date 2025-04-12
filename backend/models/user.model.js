import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: function () {
        return !this.auth0Id;
      },
    },
    auth0Id: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      enum: ["student", "recruiter"],
      required: true,
      default: "student",
    },
    isVerified: { type: Boolean, default: false },
    profile: {
      bio: { type: String },
      professionalTitle: { type: String },
      location: { type: String },
      skills: [{ type: String }],
      jobPreferences: {
        jobTypes: [{ type: String }],
        desiredSalary: { type: String },
        desiredLocation: { type: String },
        willingToRelocate: { type: Boolean, default: false },
        availability: { type: String, default: "Immediately" },
      },
      experience: [
        {
          position: { type: String },
          company: { type: String },
          duration: { type: String },
          description: { type: String },
        },
      ],
      education: [
        {
          institution: { type: String },
          degree: { type: String },
          graduationYear: { type: String },
        },
      ],
      certifications: [{ type: String }],
      resume: { type: String }, // URL to resume file
      resumeOriginalName: { type: String },
      company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
      profilePhoto: {
        type: String,
        default: "",
      },
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
