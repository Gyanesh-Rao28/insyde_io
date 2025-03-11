// src/middlewares/modelUpload.middleware.js
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Get the directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define uploads directory
const uploadsDir = path.join(__dirname, "../../uploads");

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const uniqueFilename = `${timestamp}-${file.originalname.replace(
      /\s+/g,
      "-"
    )}`;
    cb(null, uniqueFilename);
  },
});

const modelUpload = multer({
  storage: storage,
  limits: { fileSize: 200 * 1024 * 1024 }, // 50MB limit for 3D models
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      "model/stl", // STL files
      "model/obj", // OBJ files
      "application/octet-stream", // Common for binary files
      "application/vnd.ms-pki.stl", // STL MIME type used by some systems
      "application/x-tgif", // Another STL MIME type
    ];

    // Also check file extension since MIME types for 3D models are inconsistent
    const extension = file.originalname.split(".").pop().toLowerCase();
    if (
      extension === "stl" ||
      extension === "obj" ||
      allowedMimes.includes(file.mimetype)
    ) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only STL and OBJ files are allowed."));
    }
  },
});

export default modelUpload;