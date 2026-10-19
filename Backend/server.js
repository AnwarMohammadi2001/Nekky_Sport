// server.js — Final Production Version
import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import sequelize from "./config/db.js";

// ✅ Import Models (نام فایل‌ها دقیق باشد)
import categoryRoutes from "./routes/categoryRoutes.js";
import attributeRoutes from "./routes/attributeRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import sliderRoutes from "./routes/sliderRoutes.js";



// ✅ Import Routes
import authRoutes from "./routes/authRoutes.js";
import emailRoutes from "./routes/emailRoutes.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ✅ Allowed origins
const allowedOrigins = [
  "https://nekysport.com",
  // "http://localhost:3000",
  "http://localhost:5173",
  "https://backend.nekysport.com",
];

// ✅ Configure CORS
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS policy: Access denied from ${origin}`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use((err, req, res, next) => {
  if (err.message && err.message.includes("CORS")) {
    return res.status(403).json({ message: err.message });
  }
  next(err);
});

// ✅ Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// ✅ Serve static files
app.use("/uploads", express.static("uploads"));

// ✅ Test route
app.get("/", (req, res) => {
  res.send("🚀 TET Backend is running successfully...");
});

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/attributes", attributeRoutes);
app.use("/api/products", productRoutes);
app.use("/api/contact", emailRoutes);
app.use("/api/v1/website/sliders", sliderRoutes);

// ✅ 404 Handler (این را اضافه کنید تا بفهمیم چه آدرسی اشتباه است)
app.use((req, res, next) => {
  res.status(404).json({
    message: "Route not found",
    requestedUrl: req.originalUrl, // آدرس درخواستی شما را نشان می‌دهد
    method: req.method, // متد درخواست (GET, POST)
  });
});

// ✅ Start Server
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ MySQL connected via Sequelize!");

    // سینک کردن جداول (alter: true تغییرات جدید را بدون حذف داده‌ها اعمال می‌کند)
    await sequelize.sync({ alter: true });
    console.log("✅ Database tables synced successfully");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
