import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const singleUpload = (req, res, next) => {
  upload.single("file")(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};
