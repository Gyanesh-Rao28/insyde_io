// src/routes/user.route.js

import express from "express";

import {
  registerUser,
  loginUser,
  getCurrentUser,
  searchUsers,
  getAllUsers
} from "../controllers/user.controller.js";
import { authJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public route
router.post("/", registerUser);
router.post("/login", loginUser);
router.get("/search", authJWT, searchUsers);
router.get("/me", authJWT, getCurrentUser);
router.get("/allUsers", getAllUsers);


export default router;