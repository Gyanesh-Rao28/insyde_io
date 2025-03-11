// src/models/model.model.js
import mongoose from "mongoose";

const modelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Model name is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    originalFilename: {
      type: String,
      required: [true, "Original filename is required"],
    },
    fileSize: {
      type: Number,
      required: [true, "File size is required"],
    },
    fileType: {
      type: String,
      required: [true, "File type is required"],
      enum: ["STL", "OBJ", "OTHER"],
    },
    filePath: {
      type: String,
      required: [true, "File path is required"],
    },
    thumbnailPath: {
      type: String,
    },
    convertedFormats: [
      {
        format: {
          type: String,
          enum: ["STL", "OBJ", "OTHER"],
        },
        filePath: {
          type: String,
        },
        fileSize: {
          type: Number,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    defaultView: {
      position: {
        x: { type: Number, default: 0 },
        y: { type: Number, default: 0 },
        z: { type: Number, default: 5 },
      },
      rotation: {
        x: { type: Number, default: 0 },
        y: { type: Number, default: 0 },
        z: { type: Number, default: 0 },
      },
      zoom: { type: Number, default: 1 },
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Add custom methods
modelSchema.methods.incrementViewCount = function () {
  this.viewCount += 1;
  return this.save();
};

modelSchema.methods.incrementDownloadCount = function () {
  this.downloadCount += 1;
  return this.save();
};

const Model = mongoose.model("Model", modelSchema);

export default Model;
