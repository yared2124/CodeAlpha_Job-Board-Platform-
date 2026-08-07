// Express application setup: Middleware, routes, and error handling.
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import routes from "./routes/index.js";

const app = express();

// 1. Security & Utility Middleware
app.use(helmet()); // Sets secure HTTP headers
app.use(cors()); // Enables Cross-Origin Resource Sharing
app.use(morgan("dev")); // Logs HTTP requests to console
app.use(express.json({ limit: "10mb" })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true, limit: "10mb" })); // Parse URL-encoded bodies

// 2. Global Rate Limiting (prevents brute-force attacks)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Max 100 requests per IP
  message: { error: "Too many requests, please try again later." },
});
app.use(limiter);

// 3. Serve static uploaded files (resumes)
app.use("/uploads", express.static("uploads"));

// 4. Main API routes
app.use("/api", routes);

// 5. Global Error Handler (catches all unhandled errors)
app.use((err, req, res, next) => {
  console.error("Global Error:", err.stack);
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ error: message });
});

export default app;
