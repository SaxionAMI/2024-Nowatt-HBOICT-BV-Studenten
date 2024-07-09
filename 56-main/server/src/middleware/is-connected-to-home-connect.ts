import connection from "../database/connection";
import dotenv from "dotenv";

dotenv.config();

export async function hasValidAccessToken(req: any, res: any, next: any) {
    if (Date.now() - req.user.home_connect_access_token_refreshed > 1000 * 60 * 60 * 24) {
        console.log("Refreshing token");
        const request = await fetch('https://simulator.home-connect.com/security/oauth/token',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    grant_type: "refresh_token",
                    refresh_token: req.user.home_connect_refresh_token,
                    client_secret: <string>process.env.HOME_CONNECT_SECRET,
                })
            });
        let response = await request.json();
        console.log(response);
        if (request.ok) {
                await connection.query("UPDATE users SET home_connect_access_token = ?, home_connect_refresh_token = ?, home_connect_access_token_refreshed = NOW() WHERE id = ?",
                    [response.access_token, response.refresh_token, req.user.id]);
                req.user.home_connect_access_token = response.access_token;
        } else {
            res.status(request.status).send(response);
            return;
        }
    }
    next();
}

export function hasConnectedWasher(req: any, res: any, next: any) {
    if (req.user.was_machine_id) {
        next();
        return;
    }
    res.status(400).send("No washer connected");
}