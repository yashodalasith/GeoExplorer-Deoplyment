const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const authRoutes = require("./routes/authRoutes");
const errorHandler = require("./middleware/errorMiddleware");
const connectDB = require("./config/db");
require("dotenv").config();

// Initialize Express app
const app = express();

// Trust Vercel's proxy (MUST be first)
app.set("trust proxy", 1);

// Security middleware
app.use(helmet());

// Enhanced Rate limiting for Vercel
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
  message: "Too many requests from this IP, please try again later",
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false, // Disable deprecated headers
  validate: {
    trustProxy: true, // Explicitly enable proxy validation
  },
  keyGenerator: (req) => {
    // Use the first IP in X-Forwarded-For if present
    return req.headers["x-forwarded-for"]?.split(",")[0] || req.ip;
  },
});

// Apply rate limiting to all routes except auth if needed
app.use(limiter);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// Enhanced CORS configuration
const corsOptions = {
  origin: [
    process.env.FRONTEND_URL,
    "http://localhost:3000",
    "https://geo-explorer-deoplyment-frontwork.vercel.app",
  ],
  credentials: true,
  exposedHeaders: ["set-cookie"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};
app.use(cors(corsOptions));

// Routes
app.use("/api/auth", authRoutes);

// Error handling middleware
app.use(errorHandler);

// Connect to database and start server
connectDB().then(() => {
  const PORT = process.env.PORT || 5000;
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  // Handle unhandled promise rejections
  process.on("unhandledRejection", (err, promise) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
  });
});
