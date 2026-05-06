import { Request, Response } from "express";
import { JobModel } from "../models/Job";

export const getJobs = (req: Request, res: Response) => {
  const search = req.query.q as string;
  const type = req.query.type as string;
  const location = req.query.location as string;

  const jobs = JobModel.findAll(search, type, location);
  res.json(jobs);
};

export const getJobById = (req: Request, res: Response) => {
  const jobId = parseInt(req.params.id as string, 10);
  const job = JobModel.findById(jobId);

  if (!job) {
    res.status(404).json({ error: "Job not found" });
    return;
  }

  res.json(job);
};

export const toggleSaveJob = (req: Request, res: Response) => {
  const jobId = parseInt(req.params.id as string, 10);
  const { save } = req.body;

  if (save) {
    const success = JobModel.saveJob(jobId);
    if (!success) {
      res.status(404).json({ error: "Job not found" });
      return;
    }
  } else {
    JobModel.unsaveJob(jobId);
  }

  res.json({ success: true, isSaved: !!save });
};

export const getDashboardJobs = (req: Request, res: Response) => {
  res.json({
    savedJobs: JobModel.getSavedJobs(),
    recentJobs: JobModel.getRecentlyViewedJobs(),
  });
};
