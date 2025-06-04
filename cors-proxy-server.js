/**
 * Simple CORS Proxy Server for Ghana NLP API
 * Use this as an alternative if Vite proxy doesn't work
 * Run with: node cors-proxy-server.js
 */

const express = require("express");
const cors = require("cors");
const axios = require("axios");
const app = express();

// Enable CORS for all origins
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Ghana NLP API proxy endpoint
app.post("/api/translate", async (req, res) => {
  try {
    console.log("📤 Proxying request to Ghana NLP API:", req.body);

    // Get API key from environment or request headers
    const apiKey =
      process.env.GHANA_NLP_API_KEY ||
      req.headers["x-api-key"] ||
      "f61d93ed885e46629af097304e12d297";

    // Make request to Ghana NLP API
    const response = await axios.post(
      "https://translation-api.ghananlp.org/v1/translate",
      req.body,
      {
        headers: {
          "Ocp-Apim-Subscription-Key": apiKey,
          "Content-Type": "application/json",
          Accept: "application/json",
          "User-Agent": "TriAgro-CORS-Proxy/1.0",
        },
        timeout: 15000,
      }
    );

    console.log("✅ Ghana NLP API response:", response.status, response.data);

    // Forward the response
    res.json(response.data);
  } catch (error) {
    console.error("❌ Ghana NLP API Error:", error.message);

    if (error.response) {
      // API returned an error
      res.status(error.response.status).json({
        error: error.response.data,
        message: "Ghana NLP API Error",
      });
    } else if (error.request) {
      // Network error
      res.status(503).json({
        error: "Network error",
        message: "Could not reach Ghana NLP API",
      });
    } else {
      // Other error
      res.status(500).json({
        error: error.message,
        message: "Proxy server error",
      });
    }
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "TriAgro CORS Proxy Server",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 TriAgro CORS Proxy Server running on port ${PORT}`);
  console.log(`📡 Proxying Ghana NLP API requests to avoid CORS issues`);
  console.log(`🔗 Frontend should use: http://localhost:${PORT}/api/translate`);
  console.log(`🩺 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
