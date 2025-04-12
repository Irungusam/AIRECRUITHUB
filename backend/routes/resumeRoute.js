import express from "express";
import multer from "multer";
import {
  uploadResume,
  screenJobApplication,
} from "../controllers/resumeController.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/upload", upload.single("resume"), uploadResume);
router.post("/screen", screenJobApplication);

export default router;

