// src/utils/fileUpload.js
import fs from "fs";
import path from "path";
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

// Upload file locally
export const uploadFile = async (file) => {
  try {
    // Generate unique filename
    const timestamp = Date.now();
    const uniqueFilename = `${timestamp}-${file.originalname.replace(
      /\s+/g,
      "-"
    )}`;
    const filePath = path.join(uploadsDir, uniqueFilename);

    // Write file to disk
    await fs.promises.writeFile(filePath, file.buffer);

    // Return the relative URL path to access the file
    return `/uploads/${uniqueFilename}`;
  } catch (error) {
    throw new Error(`Error uploading file: ${error.message}`);
  }
};

// Delete file from local storage
export const deleteFile = async (fileUrl) => {
  try {
    if (!fileUrl || !fileUrl.startsWith("/uploads/")) {
      return true; // Skip if not a local file URL
    }

    // Extract filename from URL
    const filename = fileUrl.split("/").pop();
    const filePath = path.join(uploadsDir, filename);

    // Check if file exists
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    }

    return true;
  } catch (error) {
    console.error("Error deleting file:", error);
    return false; // Don't throw error on delete failure
  }
};
