import jwt from "jsonwebtoken";
import connection from "../database/connection";

interface jwtToken {
    user_id: string;
}

export async function tokenIsValid(req: any, res: any, next: any) {
    let token = req.headers.authorization;
    if (!token) return res.status(400).send("Token not present");
    token = token.replace("Bearer ", "");
    const decodedToken = (<jwtToken>jwt.decode(token));
    console.log(decodedToken)
    if (!decodedToken) return res.status(400).send("Invalid token");

    const userID = decodedToken.user_id;

    if (!userID) return res.status(400).send("No userID in payload");
    const [rows] = await connection.query("SELECT * FROM users WHERE id = ?", [userID]);

    interface User {
        home_connect_access_token: string,
        home_connect_refresh_token: string,
        was_machine_id: string,
        id: number
    }

    const user = (<User[]>rows)[0];
    console.log(user);
    if (!user) return res.status(404).send("No user with userID " + userID);
    if (!jwt.verify(token, "secret")) return res.status(400).send("Invalid token");
    req.user = user;
    next();
}
