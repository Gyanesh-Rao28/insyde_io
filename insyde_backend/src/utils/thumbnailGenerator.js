// src/utils/thumbnailGenerator.js
import { createCanvas } from "canvas";
import fs from "fs";
import path from "path";

export const generateThumbnail = async (filePath, fileType, outputPath) => {
  try {
    // Create a Node canvas
    const width = 300;
    const height = 300;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    // Fill background
    ctx.fillStyle = "#f0f0f0";
    ctx.fillRect(0, 0, width, height);

    // Draw 3D model representation
    // Choose color based on file type
    ctx.fillStyle = fileType === "STL" ? "#2563eb" : "#ea580c";

    // Draw a cube with perspective
    ctx.save();
    ctx.translate(width / 2, height / 2);

    // Front face
    ctx.beginPath();
    ctx.moveTo(-50, -50);
    ctx.lineTo(50, -50);
    ctx.lineTo(50, 50);
    ctx.lineTo(-50, 50);
    ctx.closePath();
    ctx.fill();

    // Top edge
    ctx.beginPath();
    ctx.moveTo(-50, -50);
    ctx.lineTo(0, -80);
    ctx.lineTo(100, -80);
    ctx.lineTo(50, -50);
    ctx.closePath();
    ctx.fillStyle = fileType === "STL" ? "#1d4ed8" : "#c2410c";
    ctx.fill();

    // Right edge
    ctx.beginPath();
    ctx.moveTo(50, -50);
    ctx.lineTo(100, -80);
    ctx.lineTo(100, 20);
    ctx.lineTo(50, 50);
    ctx.closePath();
    ctx.fillStyle = fileType === "STL" ? "#1e40af" : "#9a3412";
    ctx.fill();

    // Add text label
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 24px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(fileType, 0, 0);

    ctx.restore();

    // Draw filename
    ctx.fillStyle = "#334155";
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    ctx.fillText(path.basename(filePath), width / 2, height - 20);

    // Save the thumbnail
    const buffer = canvas.toBuffer("image/png");
    await fs.promises.writeFile(outputPath, buffer);

    return outputPath;
  } catch (error) {
    console.error("Error generating thumbnail:", error);
    throw error;
  }
};
