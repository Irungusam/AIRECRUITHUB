import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
  name: "job",
  initialState: {
    allJobs: [],
    allAdminJobs: [],
    singleJob: null,
    searchJobByText: "",
    allAppliedJobs: [],
    searchedQuery: [],
    filters: {
      // Added new filter structure while maintaining old ones
      locations: [],
      jobTypes: [],
      salaryRanges: [],
    },
  },
  reducers: {
    setAllJobs: (state, action) => {
      state.allJobs = action.payload;
    },
    setSingleJob: (state, action) => {
      state.singleJob = action.payload;
    },
    setAllAdminJobs: (state, action) => {
      state.allAdminJobs = action.payload;
    },
    setSearchJobByText: (state, action) => {
      state.searchJobByText = action.payload;
    },
    setAllAppliedJobs: (state, action) => {
      state.allAppliedJobs = action.payload;
    },
    setSearchedQuery: (state, action) => {
      state.searchedQuery = action.payload;
    },
    // New filter actions (optional)
    setLocationFilters: (state, action) => {
      state.filters.locations = action.payload;
    },
    setIndustryFilters: (state, action) => {
      state.filters.industries = action.payload;
    },
    setSalaryFilters: (state, action) => {
      state.filters.salaryRanges = action.payload;
    },
    // Add new reducer for deleting a job
    removeJob: (state, action) => {
      state.allAdminJobs = state.allAdminJobs.filter(
        (job) => job._id !== action.payload
      );
      state.allJobs = state.allJobs.filter((job) => job._id !== action.payload);
    },
  },
});

// Maintain original exports and add the new action
export const {
  setAllJobs,
  setSingleJob,
  setAllAdminJobs,
  setSearchJobByText,
  setAllAppliedJobs,
  setSearchedQuery,
  setLocationFilters,
  setIndustryFilters,
  setSalaryFilters,
  removeJob, // Export the new action
} = jobSlice.actions;

export default jobSlice.reducer;
