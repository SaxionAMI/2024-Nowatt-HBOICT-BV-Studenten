import express from "express";
import * as userController from "../controllers/user-controller";

const router = express.Router();

router.get("/settings", userController.getSettingsFromUser);
router.post("/settings", userController.updateUserSettings);

export default router;