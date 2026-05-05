import { Router } from "express";
import { getJobs, getJobById, toggleSaveJob } from "../controllers/jobController";

const router = Router();

router.get("/", getJobs);
router.get("/:id", getJobById);
router.post("/:id/save", toggleSaveJob);

export default router;
