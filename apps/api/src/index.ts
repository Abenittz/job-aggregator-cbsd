import express from "express";
import cors from "cors";
import { Job } from "@repo/types";
import { env } from "./config/env";
import { connectDatabase } from "./config/database";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "API is running 🚀" });
});

app.get("/api/jobs", (req, res) => {
  const jobs: Job[] = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      company: "TechCorp",
      location: "Remote",
      type: "Full-time",
      salary: "$120,000 - $150,000",
      description:
        "We are looking for an experienced frontend developer proficient in React and Next.js.",
      postedAt: new Date().toISOString(),
    },
    {
      id: 2,
      title: "Backend Engineer",
      company: "DataSync",
      location: "New York, NY",
      type: "Full-time",
      salary: "$130,000 - $160,000",
      description:
        "Join our data infrastructure team building high-performance Node.js microservices.",
      postedAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 3,
      title: "UI/UX Designer",
      company: "DesignCo",
      location: "San Francisco, CA",
      type: "Contract",
      salary: "$60 - $80 / hr",
      description:
        "Looking for a talented designer to revamp our core product interface.",
      postedAt: new Date(Date.now() - 172800000).toISOString(),
    },
  ];

  const search = req.query.q as string;
  if (search) {
    const lowerSearch = search.toLowerCase();
    const filteredJobs = jobs.filter(
      (job) =>
        job.title.toLowerCase().includes(lowerSearch) ||
        job.company.toLowerCase().includes(lowerSearch) ||
        job.description.toLowerCase().includes(lowerSearch),
    );
    res.json(filteredJobs);
    return;
  }

  res.json(jobs);
});

const PORT = process.env.PORT || 5000;

// Connect to database
connectDatabase();

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
  console.log(`Environment: ${env.NODE_ENV}`);
});
