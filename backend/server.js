import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";

import { connectDB } from "./config/mongodb.js";
import { router } from "./routes/auth.route.js";

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(cors({ credentials: true }));
app.use(express.json());
app.use(cookieParser());

// API Endpoints
app.get("/", (req, res) => {
  res.send("Welcome to the backend server!");
});
app.use("/api/auth", router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
