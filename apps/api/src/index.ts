import express from "express";
import cors from "cors";
import { env } from "./config/env";
import { connectDatabase } from "./config/database";
import jobRoutes from "./routes/jobRoutes";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "API is running 🚀" });
});

app.use("/api/jobs", jobRoutes);

const PORT = process.env.PORT || 5000;

// Connect to database
connectDatabase();

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
  console.log(`Environment: ${env.NODE_ENV}`);
});
