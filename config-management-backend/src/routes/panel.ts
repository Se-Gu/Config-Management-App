import express from "express";
import { validateFirebaseIdToken } from "../middleware/auth";
import * as panelController from "../controllers/panelController";

const router = express.Router();

router.get("/", validateFirebaseIdToken, panelController.getAllConfigs);
router.post("/", validateFirebaseIdToken, panelController.createOrUpdateConfig);
router.delete("/:key", validateFirebaseIdToken, panelController.deleteConfig);

export default router;
