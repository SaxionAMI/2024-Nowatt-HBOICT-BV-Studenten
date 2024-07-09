import connection from "../database/connection";

export async function getSettingsFromUser(req: any, res: any) {
    try {
        const userId = req.user.id;

        const [rows] = await connection.query('SELECT id,device,setting FROM device_settings WHERE user_id = ?', [userId]);
        return res.status(200).json(rows);
    } catch (error) {
        throw new Error('Server Error');
    }
}


export async function addSetting(req: any, res: any) {
    try {
        const userId = req.user.id;

        if (!req.body || !req.body.device || !req.body.setting) {
            return res.status(400).send('Not all required fields are provided');
        }

        const {device, setting} = req.body;

        const [result] = await connection.query('INSERT INTO device_settings (device, setting, user_id) VALUES (?, ?, ?)', [device, setting, userId]);

        return res.status(201).json({device, setting});
    } catch (error) {
        throw new Error('Server Error');
    }
}