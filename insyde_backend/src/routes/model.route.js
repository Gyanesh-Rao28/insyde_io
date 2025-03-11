// src/routes/model.route.js
import express from "express";
import modelUpload from "../middlewares/multer.middleware.js";
import { authJWT } from "../middlewares/auth.middleware.js";

import {
  uploadModel,
  getAllModels,
  getModelById,
  updateModel,
  deleteModel,
  convertModel,
  incrementViewCount,
  incrementDownloadCount,
  downloadModelFile,
  saveDefaultView,
  getDefaultView,
  getUserModels,
} from "../controllers/model.controller.js";

const router = express.Router();

// Model CRUD operations
router.post("/", authJWT, modelUpload.single("modelFile"), uploadModel);
router.get("/", getAllModels);
router.get("/:id", getModelById);
router.put("/:id", authJWT, updateModel);
router.delete("/:id", authJWT, deleteModel);

// Model manipulation
router.post("/:id/convert", authJWT, convertModel);
router.post("/:id/view", incrementViewCount);
router.post("/:id/download", incrementDownloadCount);

router.get("/:id/download-file", authJWT, downloadModelFile);

// View settings
router.post("/:id/defaultView", authJWT, saveDefaultView);
router.get("/:id/defaultView", getDefaultView);
    
// User-specific routes
router.get("/user/:userId", getUserModels);

export default router;
