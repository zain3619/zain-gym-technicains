require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const connectDB = require("./config/db");
const User = require("./models/User");

// Initialize App
const app = express();

// Secure Connections & Middlewares
app.use(helmet({
  crossOriginResourcePolicy: false, // Allows image previews across client ports
}));
app.use(cors({
  origin: "*", // Allows dynamic connection during testing
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Register API Routes
app.use("/api/v1/auth", require("./routes/authRoutes"));
app.use("/api/v1/sections", require("./routes/settingRoutes"));
app.use("/api/v1/services", require("./routes/serviceRoutes"));
app.use("/api/v1/gallery", require("./routes/galleryRoutes"));
app.use("/api/v1/team", require("./routes/teamRoutes"));
app.use("/api/v1/testimonials", require("./routes/testimonialRoutes"));
app.use("/api/v1/pricing", require("./routes/pricingRoutes"));
app.use("/api/v1/blogs", require("./routes/blogRoutes"));
app.use("/api/v1/messages", require("./routes/messageRoutes"));
app.use("/api/v1/banners", require("./routes/bannerRoutes"));

// Root Health Check
app.get("/", (req, res) => {
  res.json({ message: "Zain Gym Technicians REST API is operational" });
});

// 404 Route handler
app.use((req, res, next) => {
  res.status(404).json({ message: "Endpoint not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled Server Error:", err.stack);
  res.status(500).json({
    message: err.message || "An unhandled server error occurred",
    error: process.env.NODE_ENV === "development" ? err.stack : {},
  });
});

// Automatically Seed Master Admin Account
const seedAdmin = async () => {
  try {
    const adminCount = await User.countDocuments({ role: "admin" });
    if (adminCount === 0) {
      const defaultEmail = "admin@zaingym.com";
      const defaultPassword = "AdminPassword123";
      
      await User.create({
        username: "admin",
        email: defaultEmail,
        password: defaultPassword,
        role: "admin",
      });
      
      console.log("\n==================================================");
      console.log("MASTER ADMIN ACCOUNT SEEDED AUTOMATICALLY!");
      console.log(`Email:    ${defaultEmail}`);
      console.log(`Password: ${defaultPassword}`);
      console.log("Please modify these credentials inside the dashboard.");
      console.log("==================================================\n");
    }
  } catch (error) {
    console.error("Failed to seed admin account:", error.message);
  }
};

// Start Server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  await seedAdmin();
  
  app.listen(PORT, () => {
    console.log(`Server listening in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
  });
};

startServer();
