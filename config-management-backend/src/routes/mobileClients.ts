import express from "express";
import { validateApiToken } from "../middleware/auth";
import * as mobileClientsController from "../controllers/mobileClientsController";

const router = express.Router();

router.get("/", validateApiToken, mobileClientsController.getAggregatedConfig);

export default router;
