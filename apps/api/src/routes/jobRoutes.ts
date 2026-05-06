import { Router } from "express";
import { getJobs, getJobById, toggleSaveJob, getDashboardJobs } from "../controllers/jobController";

const router = Router();

router.get("/", getJobs);
router.get("/dashboard", getDashboardJobs);
router.get("/:id", getJobById);
router.post("/:id/save", toggleSaveJob);

export default router;
