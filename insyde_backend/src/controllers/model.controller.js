// src/controllers/model.controller.js
import Model from "../models/model.mode.js";// Fixed model import path
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { OBJExporter } from "three/examples/jsm/exporters/OBJExporter.js";


// Get the directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = path.join(__dirname, "../..");

// Helper function to determine file type from extension
const getFileType = (filename) => {
  const extension = filename.split(".").pop().toLowerCase();
  if (extension === "stl") return "STL";
  if (extension === "obj") return "OBJ";
  return "OTHER";
};

// Upload a new 3D model
export const uploadModel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    console.log("Uploaded file:", req.file);

    const fileType = getFileType(req.file.originalname);

    // Use the filename from multer disk storage
    const fileUrl = `/uploads/${req.file.filename}`;
    const fullFilePath = path.join(rootDir, fileUrl);

    // Initialize model data
    const modelData = {
      name: req.body.name || req.file.originalname,
      description: req.body.description || "",
      originalFilename: req.file.originalname,
      fileSize: req.file.size,
      fileType: fileType,
      filePath: fileUrl,
      uploadedBy: req.user._id,
    };

    // Generate a thumbnail for the model
    try {
      // Create a unique thumbnail filename
      const thumbnailFilename = `thumbnail-${
        req.file.filename.split(".")[0]
      }.png`;
      const thumbnailPath = path.join(rootDir, "uploads", thumbnailFilename);
      const thumbnailUrl = `/uploads/${thumbnailFilename}`;

      // Create a simple screenshot of the model
      const thumbnailGenerator = await import("../utils/thumbnailGenerator.js");
      await thumbnailGenerator.generateThumbnail(
        fullFilePath,
        fileType,
        thumbnailPath
      );

      // Add thumbnail URL to model data
      modelData.thumbnailPath = thumbnailUrl;
      console.log("Thumbnail generated successfully:", thumbnailUrl);
    } catch (thumbnailError) {
      console.error("Thumbnail generation failed:", thumbnailError);
      // Continue without thumbnail - it's optional
    }

    // If user provided a thumbnail, use that instead
    if (req.body.thumbnailUrl) {
      modelData.thumbnailPath = req.body.thumbnailUrl;
    }

    console.log("File URL being saved:", fileUrl);
    console.log("Complete model data:", modelData);

    const model = await Model.create(modelData);

    // After creating the model
    console.log("Model saved in database:", model);

    return res.status(201).json({
      success: true,
      data: model,
      message: "Model uploaded successfully",
    });
  } catch (error) {
    console.error("Error in uploadModel:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
// Get all models with optional filtering
export const getAllModels = async (req, res) => {
  try {
    const { fileType, search } = req.query;

    let query = {};

    if (fileType) {
      query.fileType = fileType;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const models = await Model.find(query)
      .populate("uploadedBy", "username email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: models,
      message: "Models fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

// Get a specific model by ID
export const getModelById = async (req, res) => {
  try {
    const model = await Model.findById(req.params.id).populate(
      "uploadedBy",
      "username email"
    );

    if (!model) {
      return res.status(404).json({
        success: false,
        message: "Model not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: model,
      message: "Model fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

// Update model metadata
export const updateModel = async (req, res) => {
  try {
    const model = await Model.findById(req.params.id);

    if (!model) {
      return res.status(404).json({
        success: false,
        message: "Model not found",
      });
    }

    // Check if user is the owner of the model
    if (
      model.uploadedBy &&
      model.uploadedBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this model",
      });
    }

    const updatedModel = await Model.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name: req.body.name || model.name,
          description: req.body.description || model.description,
        },
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      data: updatedModel,
      message: "Model updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

// Delete a model
export const deleteModel = async (req, res) => {
  try {
    const model = await Model.findById(req.params.id);

    if (!model) {
      return res.status(404).json({
        success: false,
        message: "Model not found",
      });
    }

    // Check if user is the owner of the model
    if (
      model.uploadedBy &&
      model.uploadedBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this model",
      });
    }

    // Delete the model file from the local filesystem
    if (model.filePath) {
      const localFilePath = path.join(rootDir, model.filePath);
      if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
      }
    }

    // Delete thumbnail if it exists
    if (model.thumbnailPath) {
      const thumbnailPath = path.join(rootDir, model.thumbnailPath);
      if (fs.existsSync(thumbnailPath)) {
        fs.unlinkSync(thumbnailPath);
      }
    }

    // Delete any converted formats
    if (model.convertedFormats && model.convertedFormats.length > 0) {
      for (const format of model.convertedFormats) {
        if (format.filePath) {
          const formatPath = path.join(rootDir, format.filePath);
          if (fs.existsSync(formatPath)) {
            fs.unlinkSync(formatPath);
          }
        }
      }
    }

    await Model.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Model deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting model:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

// Convert model format (bonus feature)
export const convertModel = async (req, res) => {
  try {
    const { targetFormat } = req.body;

    if (!targetFormat || !["STL", "OBJ"].includes(targetFormat)) {
      return res.status(400).json({
        success: false,
        message: "Invalid target format. Must be STL or OBJ",
      });
    }

    const model = await Model.findById(req.params.id);

    if (!model) {
      return res.status(404).json({
        success: false,
        message: "Model not found",
      });
    }

    // Check if the model is already in the target format
    if (model.fileType === targetFormat) {
      return res.status(400).json({
        success: false,
        message: `Model is already in ${targetFormat} format`,
      });
    }

    // Check if the conversion already exists
    const existingConversion = model.convertedFormats.find(
      (format) => format.format === targetFormat
    );

    if (existingConversion) {
      return res.status(200).json({
        success: true,
        data: {
          format: existingConversion.format,
          filePath: existingConversion.filePath,
        },
        message: `Model already converted to ${targetFormat}`,
      });
    }

    // Start conversion process
    const sourceFilePath = path.join(rootDir, model.filePath);
    const timestamp = Date.now();
    let newFilename;

    if (targetFormat === "OBJ") {
      newFilename = `${timestamp}-${model.originalFilename.replace(
        ".stl",
        ".obj"
      )}`;
    } else {
      newFilename = `${timestamp}-${model.originalFilename.replace(
        ".obj",
        ".stl"
      )}`;
    }

    const targetFilePath = path.join(rootDir, "uploads", newFilename);
    const fileUrl = `/uploads/${newFilename}`;

    // Conversion logic
    if (model.fileType === "STL" && targetFormat === "OBJ") {
      try {
        // Read the source file
        const fileData = await fs.promises.readFile(sourceFilePath);

        // Convert Node.js Buffer to ArrayBuffer
        const arrayBuffer = new Uint8Array(fileData).buffer;

        // Parse STL
        const geometry = new STLLoader().parse(arrayBuffer);
        const material = new THREE.MeshStandardMaterial();
        const mesh = new THREE.Mesh(geometry, material);
        const exporter = new OBJExporter();
        const result = exporter.parse(mesh);

        // Write the OBJ file
        await fs.promises.writeFile(targetFilePath, result);
      } catch (conversionError) {
        console.error("STL to OBJ conversion error:", conversionError);
        return res.status(500).json({
          success: false,
          message: `STL to OBJ conversion failed: ${conversionError.message}`,
        });
      }
    } else if (model.fileType === "OBJ" && targetFormat === "STL") {
      // This conversion is more complex and would require additional libraries
      return res.status(501).json({
        success: false,
        message: "OBJ to STL conversion not fully implemented yet",
      });
    }

    // Update the model with the new format
    const convertedFormat = {
      format: targetFormat,
      filePath: fileUrl,
      fileSize: (await fs.promises.stat(targetFilePath)).size,
      createdAt: new Date(),
    };

    model.convertedFormats.push(convertedFormat);
    await model.save();

    return res.status(200).json({
      success: true,
      data: convertedFormat,
      message: `Model converted to ${targetFormat} successfully`,
    });
  } catch (error) {
    console.error("Conversion error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

// Increment view count
export const incrementViewCount = async (req, res) => {
  try {
    const model = await Model.findById(req.params.id);

    if (!model) {
      return res.status(404).json({
        success: false,
        message: "Model not found",
      });
    }

    model.viewCount += 1;
    await model.save();

    return res.status(200).json({
      success: true,
      data: { viewCount: model.viewCount },
      message: "View count incremented",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

// Increment download count
export const incrementDownloadCount = async (req, res) => {
  try {
    const model = await Model.findById(req.params.id);

    if (!model) {
      return res.status(404).json({
        success: false,
        message: "Model not found",
      });
    }

    model.downloadCount += 1;
    await model.save();

    return res.status(200).json({
      success: true,
      data: { downloadCount: model.downloadCount },
      message: "Download count incremented",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

// Download model file
export const downloadModelFile = async (req, res) => {
  try {
    const model = await Model.findById(req.params.id);

    if (!model) {
      return res.status(404).json({
        success: false,
        message: "Model not found",
      });
    }

    // For local files, we use the absolute path
    const filePath = path.join(rootDir, model.filePath);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    // Set appropriate headers for download
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${model.originalFilename}`
    );
    res.setHeader("Content-Type", "application/octet-stream");

    // Stream the file to the response
    fs.createReadStream(filePath).pipe(res);
  } catch (error) {
    console.error("Error downloading file:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

// Save default view settings
export const saveDefaultView = async (req, res) => {
  try {
    const { position, rotation, zoom } = req.body;

    if (!position || !rotation || !zoom) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid view settings. Must include position, rotation, and zoom",
      });
    }

    const model = await Model.findById(req.params.id);

    if (!model) {
      return res.status(404).json({
        success: false,
        message: "Model not found",
      });
    }

    // Check if user is the owner of the model
    if (
      model.uploadedBy &&
      model.uploadedBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this model",
      });
    }

    model.defaultView = {
      position,
      rotation,
      zoom,
    };

    await model.save();

    return res.status(200).json({
      success: true,
      data: model.defaultView,
      message: "Default view saved successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

// Get default view settings
export const getDefaultView = async (req, res) => {
  try {
    const model = await Model.findById(req.params.id);

    if (!model) {
      return res.status(404).json({
        success: false,
        message: "Model not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: model.defaultView,
      message: "Default view fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

// Get all models uploaded by a specific user
export const getUserModels = async (req, res) => {
  try {
    const models = await Model.find({ uploadedBy: req.params.userId })
      .populate("uploadedBy", "username email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: models,
      message: "User models fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};




