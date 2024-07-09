import express from "express";
import * as deviceController from "../controllers/device-controller";

const router = express.Router();

router.get("/setting", deviceController.getSettingsFromUser);
router.post("/setting", deviceController.addSetting);

export default router;