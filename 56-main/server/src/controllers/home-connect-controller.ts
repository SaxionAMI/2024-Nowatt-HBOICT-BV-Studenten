import connection from "../database/connection";
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

dotenv.config();

export async function getAuthorization(req: any, res: any) {
    console.log(req.query.code);
    const request = await fetch('https://simulator.home-connect.com/security/oauth/token',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                grant_type: "authorization_code",
                client_id: <string>process.env.HOME_CONNECT_ID,
                client_secret: <string>process.env.HOME_CONNECT_SECRET,
                redirect_uri: "http://localhost:3000/home-connect/authorize",
                code: req.query.code
            })
        });
    let response = await request.json();
    console.log(response);
    if (request.ok) {
        const request = await fetch("https://simulator.home-connect.com/api/homeappliances/", {
                method: "GET",
                headers: {
                    'accept': 'application/vnd.bsh.sdk.v1+json',
                    'Authorization': 'Bearer ' + response.access_token
                }
            }
        );
        if (request.ok) {
            const appliances = (await request.json()).data.homeappliances;
            console.log(appliances);
            const washer = appliances.find((appliance: { type: any; }) => appliance.type == "Washer");
            console.log(washer);

            interface UserId {
                userID: number
            }

            await connection.query("INSERT INTO users (home_connect_access_token, home_connect_refresh_token, home_connect_access_token_refreshed, was_machine_id) " +
                "VALUES (?, ?, NOW(), ?)", [response.access_token, response.refresh_token, washer.haId]);
            const [result] = await connection.query("SELECT LAST_INSERT_ID() AS userID");
            const userID = (<UserId[]>result)[0].userID;
            res.redirect("http://localhost:5173?token=" + encodeURIComponent(jwt.sign({user_id: userID}, "secret")));
        } else {
            console.log(request.status);
            console.log(response);
            res.status(request.status).send(response);
        }
    } else {
        res.status(request.status).send(response);
    }
}

export async function getPrograms(req: any, res: any) {
    let homeApplianceID = req.user.was_machine_id;
    const request = await fetch('https://simulator.home-connect.com/api/homeappliances/' + homeApplianceID + '/programs/available',
        {
            method: 'GET',
            headers: {
                'accept': 'application/vnd.bsh.sdk.v1+json',
                'Authorization': 'Bearer ' + req.user.home_connect_access_token
            }
        });
    const response = await request.json();
    console.log(response);
    if (request.ok) {
        const programs = [];
        for (const program of response.data.programs) {
            const response = await (await fetch('https://simulator.home-connect.com/api/homeappliances/' + homeApplianceID + '/programs/available/' + program.key,
                {
                    method: 'GET',
                    headers: {
                        'accept': 'application/vnd.bsh.sdk.v1+json',
                        'Authorization': 'Bearer ' + req.user.home_connect_access_token
                    }
                })).json();
            programs.push(response.data);
        }
        res.status(200).json(programs);
    } else {
        res.status(request.status).send(response);
    }
}

export async function startProgram(req: any, res: any) {
    console.log(req.body);
    const request = await fetch('https://simulator.home-connect.com/api/homeappliances/' + req.user.was_machine_id + '/programs/active',
        {
            method: 'PUT',
            headers: {
                'accept': 'application/vnd.bsh.sdk.v1+json',
                'Content-Type': 'application/vnd.bsh.sdk.v1+json',
                'Authorization': 'Bearer ' + req.user.home_connect_access_token
            },
            body: JSON.stringify(req.body)
        });
    if (request.ok) {
        res.status(204).send();
    } else {
        res.status(request.status).send(await request.json());
    }
}

export async function getEvents(req: any, res: any) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    let stop = false;

    req.connection.on('close', function () {
        stop = true;
    });

        const request = await fetch("https://simulator.home-connect.com/api/homeappliances/" + req.user.was_machine_id + "/events",
            {
                method: "GET",
                headers: {
                    'Authorization': 'Bearer ' + req.user.home_connect_access_token,
                    'Accept': "text/event-stream"
                }
            });
        if (!request.ok) {
            console.log(await request.json());
            res.send();
        } else {
            // @ts-ignore
            const reader = request.body.getReader();
            const decoder = new TextDecoder('utf-8');

            // @ts-ignore
            reader.read().then(function processText({done, value}) {
                if (done || stop) {
                    console.log('Stream closed');
                    return;
                }

                let buffer = decoder.decode(value, {stream: true});

                console.log("Buffer: " + buffer);

                let parts = buffer.split('\n\n')[0].split('\n');
                console.log(parts);

                if (parts[0] != "event: KEEP-ALIVE") {
                    console.log("Sent: " + parts[1]);
                    res.write(`${parts[1]}\n\n`);

                    const haid = parts[2].substring(4);
                    const json = JSON.parse(parts[1].substring(6));
                    json.items.forEach((item: any) => {
                        connection.query("INSERT INTO wasmachine_history (user_id, wasmachine_id, `key`, value, created_at) " +
                            "VALUES (?,?,?,?,NOW())", [req.user.id, haid, item.key, item.value]);
                    });
                }

                return reader.read().then(processText);
            });

        }
}

export async function getStatus(req: any, res: any) {
    let homeApplianceID = req.user.was_machine_id;
    const request = await fetch('https://simulator.home-connect.com/api/homeappliances/' + homeApplianceID + '/status',
        {
            method: 'GET',
            headers: {
                'accept': 'application/vnd.bsh.sdk.v1+json',
                'Authorization': 'Bearer ' + req.user.home_connect_access_token
            }
        });
    res.status(request.status).send(await request.json());
}

export async function stopProgram(req: any, res: any) {
    let homeApplianceID = req.user.was_machine_id;
    const request = await fetch('https://simulator.home-connect.com/api/homeappliances/' + homeApplianceID + '/programs/active',
        {
            method: 'DELETE',
            headers: {
                'accept': 'application/vnd.bsh.sdk.v1+json',
                'Authorization': 'Bearer ' + req.user.home_connect_access_token
            }
        });
    res.status(request.status).send();
}

export async function getSelectedProgram(req: any, res: any) {
    let homeApplianceID = req.user.was_machine_id;
    const request = await fetch('https://simulator.home-connect.com/api/homeappliances/' + homeApplianceID + '/programs/selected',
        {
            method: 'GET',
            headers: {
                'accept': 'application/vnd.bsh.sdk.v1+json',
                'Authorization': 'Bearer ' + req.user.home_connect_access_token
            }
        });
    res.status(request.status).send(await request.json());
}

export async function setProgram(req: any, res: any) {
    console.log(req.body);
    const request = await fetch('https://simulator.home-connect.com/api/homeappliances/' + req.user.was_machine_id + '/programs/selected',
        {
            method: 'PUT',
            headers: {
                'accept': 'application/vnd.bsh.sdk.v1+json',
                'Content-Type': 'application/vnd.bsh.sdk.v1+json',
                'Authorization': 'Bearer ' + req.user.home_connect_access_token
            },
            body: JSON.stringify(req.body)
        });
    if (request.ok) {
        res.status(204).send();
    } else {
        res.status(request.status).send(await request.json());
    }
}