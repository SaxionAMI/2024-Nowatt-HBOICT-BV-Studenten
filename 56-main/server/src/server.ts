import express from 'express';
import home_connect_route from "./routes/home-connect-route";
import userRoute from "./routes/user-route";
import weatherRoute from "./routes/weather-route";
import cors from "cors";
import deviceRoute from "./routes/device-route";
import * as isLoggedInMiddleware from "./middleware/is-logged-in";
import * as homeConnectMiddleware from "./middleware/is-connected-to-home-connect";

const app = express();

const port = 3000;

app.use(cors());
app.use(express.json());

app.use("/home-connect", home_connect_route);
app.use(isLoggedInMiddleware.tokenIsValid, homeConnectMiddleware.hasConnectedWasher, homeConnectMiddleware.hasValidAccessToken);
app.use('/users', userRoute);
app.use('/weather', weatherRoute);
app.use('/devices', deviceRoute);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});