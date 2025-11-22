import multer from "multer";
import { Request } from "express";

// Configure multer to store files in memory
const storage = multer.memoryStorage();

// File filter to accept only images and videos
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  // Accept images
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  }
  // Accept videos
  else if (file.mimetype.startsWith("video/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image and video files are allowed!"));
  }
};

// Configure multer
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
    files: 10, // Max 10 files
  },
});
