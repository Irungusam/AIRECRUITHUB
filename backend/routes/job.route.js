import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  deleteJob,
  getAdminJobs,
  getAllJobs,
  getJobById,
  postJob,
  updateJob,
} from "../controllers/job.controller.js";
import authMiddleware from "../middlewares/Midchoice.js";
const router = express.Router();

router.route("/post").post(isAuthenticated, postJob);
router.route("/get").get(isAuthenticated, getAllJobs);
router.route("/getadminjobs").get(isAuthenticated, getAdminJobs);
router.route("/get/:id").get(isAuthenticated, getJobById);
router.route("/update/:id").put(isAuthenticated, updateJob);
router.route("/:id").put(isAuthenticated, updateJob);
// Add delete endpoint
router.route("/delete/:id").delete(isAuthenticated, deleteJob);

export default router;
