// src/app.js
import express from "express";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true,
  })
);

app.use(express.json());

import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Import routes
import userRoute from "./routes/user.route.js";
import modelRoute from "./routes/model.route.js";

// Route for testing
app.use("/api/v1/test", (req, res) => {
  res.send({
    testingAPI: "working",
  });
});

// Use routes
app.use("/api/v1/users", userRoute);
app.use("/api/v1/models", modelRoute);

export { app };
