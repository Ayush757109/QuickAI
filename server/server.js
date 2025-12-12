import "dotenv/config";
import cors from 'cors';
import express from "express";
import { clerkMiddleware, requireAuth } from "@clerk/express";
import aiRouter from "./routes/aiRoutes.js";
import bodyParser  from "body-parser";
import connectCloudinary from "./configs/cloudinary.js";
import userRouter from "./routes/userRoutes.js"; 

const app = express();
await connectCloudinary()
app.use(cors());
app.use(express.json());

// Clerk middleware first
app.use(clerkMiddleware());

// Public route
app.get("/", (req, res) => {
  res.send("Server is live");
});

// Protected AI routes
app.use("/api/ai", requireAuth(), aiRouter);
app.use("/api/user", requireAuth(), userRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
