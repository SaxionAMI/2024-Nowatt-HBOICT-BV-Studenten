import express from "express";
import * as weatherController from "../controllers/weather-controller";

const router = express.Router();

router.get("/:city", weatherController.getWeather);

export default router;