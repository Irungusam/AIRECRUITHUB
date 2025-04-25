import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea"; // You'll need to import this component
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { X, Loader2, Plus, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Checkbox } from "./ui/checkbox";

const UpdateProfileDialog = ({ open, setOpen }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const [input, setInput] = useState({
    fullname: user?.fullname || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    bio: user?.profile?.bio || "",
    professionalTitle: user?.profile?.professionalTitle || "",
    location: user?.profile?.location || "",
    skills: user?.profile?.skills || [],
    jobPreferences: user?.profile?.jobPreferences || {
      jobTypes: [],
      desiredSalary: "",
      desiredLocation: "",
      willingToRelocate: false,
      availability: "Immediately",
    },
    experience: user?.profile?.experience || [],
    education: user?.profile?.education || [],
    certifications: user?.profile?.certifications || [],
    file: user?.profile?.resume || null,
  });

  const [newSkill, setNewSkill] = useState("");
  const [newCertification, setNewCertification] = useState("");

  // Current editing states for multi-item sections
  const [currentExperience, setCurrentExperience] = useState({
    position: "",
    company: "",
    duration: "",
    description: "",
  });

  const [currentEducation, setCurrentEducation] = useState({
    institution: "",
    degree: "",
    graduationYear: "",
  });

  // Handle Input Change for simple fields
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  // Handle job preferences change
  const handleJobPreferenceChange = (field, value) => {
    setInput({
      ...input,
      jobPreferences: {
        ...input.jobPreferences,
        [field]: value,
      },
    });
  };

  // Toggle job type selection
  const toggleJobType = (jobType) => {
    const currentJobTypes = input.jobPreferences.jobTypes;
    const updatedJobTypes = currentJobTypes.includes(jobType)
      ? currentJobTypes.filter((type) => type !== jobType)
      : [...currentJobTypes, jobType];

    handleJobPreferenceChange("jobTypes", updatedJobTypes);
  };

  // Handle Resume File Upload
  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    setInput({ ...input, file });
  };

  // Skills Management
  const addSkill = () => {
    if (newSkill.trim() && !input.skills.includes(newSkill.trim())) {
      setInput({ ...input, skills: [...input.skills, newSkill.trim()] });
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setInput({
      ...input,
      skills: input.skills.filter((skill) => skill !== skillToRemove),
    });
  };

  // Certifications Management
  const addCertification = () => {
    if (
      newCertification.trim() &&
      !input.certifications.includes(newCertification.trim())
    ) {
      setInput({
        ...input,
        certifications: [...input.certifications, newCertification.trim()],
      });
      setNewCertification("");
    }
  };

  const removeCertification = (certToRemove) => {
    setInput({
      ...input,
      certifications: input.certifications.filter(
        (cert) => cert !== certToRemove
      ),
    });
  };

  // Experience Management
  const addExperience = () => {
    if (currentExperience.position.trim() && currentExperience.company.trim()) {
      setInput({
        ...input,
        experience: [...input.experience, { ...currentExperience }],
      });
      setCurrentExperience({
        position: "",
        company: "",
        duration: "",
        description: "",
      });
    }
  };

  const removeExperience = (index) => {
    const updatedExperience = [...input.experience];
    updatedExperience.splice(index, 1);
    setInput({ ...input, experience: updatedExperience });
  };

  // Education Management
  const addEducation = () => {
    if (currentEducation.institution.trim() && currentEducation.degree.trim()) {
      setInput({
        ...input,
        education: [...input.education, { ...currentEducation }],
      });
      setCurrentEducation({ institution: "", degree: "", graduationYear: "" });
    }
  };

  const removeEducation = (index) => {
    const updatedEducation = [...input.education];
    updatedEducation.splice(index, 1);
    setInput({ ...input, education: updatedEducation });
  };

  // Handle Form Submission
  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    // Basic info
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("bio", input.bio);
    formData.append("professionalTitle", input.professionalTitle);
    formData.append("location", input.location);

    // Skills
    input.skills.forEach((skill) => {
      formData.append("skills[]", skill);
    });

    // Job Preferences - Convert object to JSON string
    formData.append("jobPreferences", JSON.stringify(input.jobPreferences));

    // Experience - Convert array to JSON string
    formData.append("experience", JSON.stringify(input.experience));

    // Education - Convert array to JSON string
    formData.append("education", JSON.stringify(input.education));

    // Certifications
    input.certifications.forEach((cert) => {
      formData.append("certifications[]", cert);
    });

    // Resume file
    if (input.file) {
      formData.append("file", input.file);
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${USER_API_END_POINT}/profile/update`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Profile update failed");
    } finally {
      setLoading(false);
    }

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="sm:max-w-[450px] md:max-w-[650px] lg:max-w-[800px] max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
        onInteractOutside={() => setOpen(false)}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            Update Profile
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={submitHandler}>
          <div className="space-y-6 py-4">
            {/* Basic Information Section */}
            <div className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-md font-medium mb-4 text-gray-800 dark:text-gray-100">
                Basic Information
              </h3>

              {/* Full Name */}
              <div className="grid grid-cols-4 items-center gap-4 mb-4">
                <Label
                  htmlFor="name"
                  className="text-right text-gray-700 dark:text-gray-300"
                >
                  Full Name
                </Label>
                <Input
                  id="name"
                  name="fullname"
                  type="text"
                  value={input.fullname}
                  onChange={changeEventHandler}
                  className="col-span-3"
                />
              </div>

              {/* Professional Title */}
              <div className="grid grid-cols-4 items-center gap-4 mb-4">
                <Label
                  htmlFor="professionalTitle"
                  className="text-right text-gray-700 dark:text-gray-300"
                >
                  Professional Title
                </Label>
                <Input
                  id="professionalTitle"
                  name="professionalTitle"
                  type="text"
                  placeholder="e.g. Senior Software Engineer"
                  value={input.professionalTitle}
                  onChange={changeEventHandler}
                  className="col-span-3"
                />
              </div>

              {/* Email */}
              <div className="grid grid-cols-4 items-center gap-4 mb-4">
                <Label
                  htmlFor="email"
                  className="text-right text-gray-700 dark:text-gray-300"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={input.email}
                  onChange={changeEventHandler}
                  className="col-span-3"
                />
              </div>

              {/* Phone Number */}
              <div className="grid grid-cols-4 items-center gap-4 mb-4">
                <Label
                  htmlFor="number"
                  className="text-right text-gray-700 dark:text-gray-300"
                >
                  Phone Number
                </Label>
                <Input
                  id="number"
                  name="phoneNumber"
                  value={input.phoneNumber}
                  onChange={changeEventHandler}
                  className="col-span-3"
                />
              </div>

              {/* Location */}
              <div className="grid grid-cols-4 items-center gap-4 mb-4">
                <Label
                  htmlFor="location"
                  className="text-right text-gray-700 dark:text-gray-300"
                >
                  Location
                </Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="City, Country"
                  value={input.location}
                  onChange={changeEventHandler}
                  className="col-span-3"
                />
              </div>

              {/* Bio */}
              <div className="grid grid-cols-4 items-start gap-4">
                <Label
                  htmlFor="bio"
                  className="text-right text-gray-700 dark:text-gray-300 pt-2"
                >
                  Bio
                </Label>
                <Textarea
                  id="bio"
                  name="bio"
                  rows={3}
                  value={input.bio}
                  onChange={changeEventHandler}
                  className="col-span-3"
                  placeholder="Write a short bio about yourself..."
                />
              </div>
            </div>

            {/* Job Preferences Section */}
            <div className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-md font-medium mb-4 text-gray-800 dark:text-gray-100">
                Job Preferences
              </h3>

              {/* Job Types */}
              <div className="grid grid-cols-4 items-start gap-4 mb-4">
                <Label className="text-right text-gray-700 dark:text-gray-300 pt-2">
                  Job Types
                </Label>
                <div className="col-span-3 flex flex-wrap gap-3">
                  {[
                    "Full-time",
                    "Part-time",
                    "Contract",
                    "Freelance",
                    "Remote",
                    "Hybrid",
                    "On-site",
                  ].map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={`job-type-${type}`}
                        checked={input.jobPreferences.jobTypes.includes(type)}
                        onCheckedChange={() => toggleJobType(type)}
                      />
                      <label
                        htmlFor={`job-type-${type}`}
                        className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
                      >
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Desired Salary */}
              <div className="grid grid-cols-4 items-center gap-4 mb-4">
                <Label
                  htmlFor="desiredSalary"
                  className="text-right text-gray-700 dark:text-gray-300"
                >
                  Desired Salary
                </Label>
                <Input
                  id="desiredSalary"
                  placeholder="e.g. Ksh80,000 - Ksh100,000"
                  value={input.jobPreferences.desiredSalary}
                  onChange={(e) =>
                    handleJobPreferenceChange("desiredSalary", e.target.value)
                  }
                  className="col-span-3"
                />
              </div>

              {/* Desired Location */}
              <div className="grid grid-cols-4 items-center gap-4 mb-4">
                <Label
                  htmlFor="desiredLocation"
                  className="text-right text-gray-700 dark:text-gray-300"
                >
                  Desired Location
                </Label>
                <Input
                  id="desiredLocation"
                  placeholder="e.g. Nairobi, Kenya"
                  value={input.jobPreferences.desiredLocation}
                  onChange={(e) =>
                    handleJobPreferenceChange("desiredLocation", e.target.value)
                  }
                  className="col-span-3"
                />
              </div>

              {/* Willing to Relocate */}
              <div className="grid grid-cols-4 items-center gap-4 mb-4">
                <Label
                  htmlFor="willingToRelocate"
                  className="text-right text-gray-700 dark:text-gray-300"
                >
                  Willing to Relocate
                </Label>
                <div className="col-span-3 flex items-center">
                  <Checkbox
                    id="willingToRelocate"
                    checked={input.jobPreferences.willingToRelocate}
                    onCheckedChange={(checked) =>
                      handleJobPreferenceChange("willingToRelocate", checked)
                    }
                  />
                  <label
                    htmlFor="willingToRelocate"
                    className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Yes, I'm willing to relocate
                  </label>
                </div>
              </div>

              {/* Availability */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="availability"
                  className="text-right text-gray-700 dark:text-gray-300"
                >
                  Availability
                </Label>
                <Select
                  value={input.jobPreferences.availability}
                  onValueChange={(value) =>
                    handleJobPreferenceChange("availability", value)
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Immediately">Immediately</SelectItem>
                    <SelectItem value="2 weeks">2 weeks</SelectItem>
                    <SelectItem value="1 month">1 month</SelectItem>
                    <SelectItem value="2+ months">2+ months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Skills Section */}
            <div className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-md font-medium mb-4 text-gray-800 dark:text-gray-100">
                Skills
              </h3>

              <div className="grid grid-cols-4 gap-4">
                <Label
                  htmlFor="skills"
                  className="text-right text-gray-700 dark:text-gray-300"
                >
                  Skills
                </Label>
                <div className="col-span-3">
                  {/* Display Existing Skills */}
                  <div className="flex flex-wrap gap-2 mb-2">
                    {input.skills.length > 0 ? (
                      input.skills.map((skill, index) => (
                        <Badge
                          key={index}
                          className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 flex items-center gap-1"
                        >
                          {skill}
                          <X
                            className="h-4 w-4 cursor-pointer text-red-500"
                            onClick={() => removeSkill(skill)}
                          />
                        </Badge>
                      ))
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400">
                        No skills added
                      </span>
                    )}
                  </div>

                  {/* Add Skill Input */}
                  <div className="flex items-center gap-2">
                    <Input
                      type="text"
                      placeholder="Add a skill..."
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addSkill();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={addSkill}
                      className="bg-green-600 hover:bg-green-500 text-white px-3 py-2 rounded-lg"
                    >
                      <Plus className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Experience Section */}
            <div className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-md font-medium mb-4 text-gray-800 dark:text-gray-100">
                Work Experience
              </h3>

              {/* Existing Experience Items */}
              {input.experience.length > 0 && (
                <div className="mb-4">
                  {input.experience.map((exp, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-2 p-3 mb-2 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="font-medium">{exp.position}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          {exp.company}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {exp.duration}
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeExperience(index)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add New Experience */}
              <div className="space-y-3 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Add New Experience
                </h4>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="position" className="text-sm">
                      Position
                    </Label>
                    <Input
                      id="position"
                      placeholder="e.g. Software Engineer"
                      value={currentExperience.position}
                      onChange={(e) =>
                        setCurrentExperience({
                          ...currentExperience,
                          position: e.target.value,
                        })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="company" className="text-sm">
                      Company
                    </Label>
                    <Input
                      id="company"
                      placeholder="e.g. Tech Solutions Inc."
                      value={currentExperience.company}
                      onChange={(e) =>
                        setCurrentExperience({
                          ...currentExperience,
                          company: e.target.value,
                        })
                      }
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="duration" className="text-sm">
                    Duration
                  </Label>
                  <Input
                    id="duration"
                    placeholder="e.g. June 2022 - Present"
                    value={currentExperience.duration}
                    onChange={(e) =>
                      setCurrentExperience({
                        ...currentExperience,
                        duration: e.target.value,
                      })
                    }
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-sm">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of your responsibilities and achievements"
                    value={currentExperience.description}
                    onChange={(e) =>
                      setCurrentExperience({
                        ...currentExperience,
                        description: e.target.value,
                      })
                    }
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <Button
                  type="button"
                  onClick={addExperience}
                  className="w-full bg-green-600 hover:bg-green-500 text-white"
                >
                  Add Experience
                </Button>
              </div>
            </div>

            {/* Education Section */}
            <div className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-md font-medium mb-4 text-gray-800 dark:text-gray-100">
                Education
              </h3>

              {/* Existing Education Items */}
              {input.education.length > 0 && (
                <div className="mb-4">
                  {input.education.map((edu, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-2 p-3 mb-2 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="font-medium">{edu.institution}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          {edu.degree}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Graduated {edu.graduationYear}
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeEducation(index)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add New Education */}
              <div className="space-y-3 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Add New Education
                </h4>

                <div>
                  <Label htmlFor="institution" className="text-sm">
                    Institution
                  </Label>
                  <Input
                    id="institution"
                    placeholder="e.g. Meru University"
                    value={currentEducation.institution}
                    onChange={(e) =>
                      setCurrentEducation({
                        ...currentEducation,
                        institution: e.target.value,
                      })
                    }
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="degree" className="text-sm">
                    Degree/Field of Study
                  </Label>
                  <Input
                    id="degree"
                    placeholder="e.g. Bachelor of Science in Computer Science"
                    value={currentEducation.degree}
                    onChange={(e) =>
                      setCurrentEducation({
                        ...currentEducation,
                        degree: e.target.value,
                      })
                    }
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="graduationYear" className="text-sm">
                    Graduation Year
                  </Label>
                  <Input
                    id="graduationYear"
                    placeholder="e.g. 2022"
                    value={currentEducation.graduationYear}
                    onChange={(e) =>
                      setCurrentEducation({
                        ...currentEducation,
                        graduationYear: e.target.value,
                      })
                    }
                    className="mt-1"
                  />
                </div>

                <Button
                  type="button"
                  onClick={addEducation}
                  className="w-full bg-green-600 hover:bg-green-500 text-white"
                >
                  Add Education
                </Button>
              </div>
            </div>

            {/* Certifications Section */}
            <div className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-md font-medium mb-4 text-gray-800 dark:text-gray-100">
                Certifications
              </h3>

              <div className="grid grid-cols-4 gap-4">
                <Label
                  htmlFor="certifications"
                  className="text-right text-gray-700 dark:text-gray-300"
                >
                  Certifications
                </Label>
                <div className="col-span-3">
                  {/* Display Existing Certifications */}
                  <div className="flex flex-wrap gap-2 mb-2">
                    {input.certifications.length > 0 ? (
                      input.certifications.map((cert, index) => (
                        <Badge
                          key={index}
                          className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 flex items-center gap-1"
                        >
                          {cert}
                          <X
                            className="h-4 w-4 cursor-pointer text-red-500"
                            onClick={() => removeCertification(cert)}
                          />
                        </Badge>
                      ))
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400">
                        No certifications added
                      </span>
                    )}
                  </div>

                  {/* Add Certification Input */}
                  <div className="flex items-center gap-2">
                    <Input
                      type="text"
                      placeholder="Add a certification..."
                      value={newCertification}
                      onChange={(e) => setNewCertification(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addCertification();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={addCertification}
                      className="bg-green-600 hover:bg-green-500 text-white px-3 py-2 rounded-lg"
                    >
                      <Plus className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Resume Upload */}
            <div className="grid grid-cols-4 gap-4">
              <Label
                htmlFor="file"
                className="text-right text-gray-700 dark:text-gray-300"
              >
                Resume
              </Label>
              <div className="col-span-3">
                <Input
                  id="file"
                  name="file"
                  type="file"
                  accept="application/pdf"
                  onChange={fileChangeHandler}
                />
                {user?.profile?.resume && (
                  <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Current resume:{" "}
                    {user?.profile?.resumeOriginalName || "resume.pdf"}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <DialogFooter>
            {loading ? (
              <Button
                className="w-full bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
                disabled
              >
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Please wait...
              </Button>
            ) : (
              <Button
                type="submit"
                className="w-full bg-blue-500 text-white hover:bg-blue-600"
              >
                Update Profile
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProfileDialog;
