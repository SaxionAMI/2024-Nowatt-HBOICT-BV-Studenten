import express from 'express';
import * as homeConnectController from "../controllers/home-connect-controller";
import * as homeConnectMiddleware from "../middleware/is-connected-to-home-connect";
import * as isLoggedInMiddleware from "../middleware/is-logged-in";

const router = express.Router();

router.get("/authorize", homeConnectController.getAuthorization);
router.use(isLoggedInMiddleware.tokenIsValid, homeConnectMiddleware.hasConnectedWasher, homeConnectMiddleware.hasValidAccessToken);
router.post("/start", homeConnectController.startProgram);
router.get('/programs', homeConnectController.getPrograms);
router.get('/events', homeConnectController.getEvents);
router.get('/status', homeConnectController.getStatus);
router.delete("/active-program", homeConnectController.stopProgram);
router.get("/selected-program", homeConnectController.getSelectedProgram);
router.put("/selected-program", homeConnectController.setProgram);

export default router;