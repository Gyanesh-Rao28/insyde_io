// src/controllers/user.controller.js
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

const generateAccessToken = (userId) => {
  return jwt.sign({ _id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};

export const registerUser = async (req, res) => {
  try {
    const {
      username,
      email,
      password
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User with email or username already exists",
      });
    }

    // Create new user
    const user = await User.create({
      username,
      email,
      password
    });

    const createdUser = await User.findById(user._id).select("-password");

    if (!createdUser) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong while registering the user",
      });
    }

    return res.status(201).json({
      success: true,
      data: createdUser,
      message: "User registered successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User does not exist",
      });
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = generateAccessToken(user._id);
    const loggedInUser = await User.findById(user._id).select("-password");

    return res.status(200).json({
      success: true,
      data: {
        user: loggedInUser,
        token,
      },
      message: "User logged in successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
      message: "User fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const { name } = req.query;

    const users = await User.find({
      $or: [
        { username: { $regex: name, $options: "i" } },
        { email: { $regex: name, $options: "i" } },
      ],
    }).select("-password");

    return res.status(200).json({
      success: true,
      data: users,
      message: "Users fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {

    const users = await User.find({}).select("-password");

    return res.status(200).json({
      success: true,
      data: users,
      message: "Users fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};