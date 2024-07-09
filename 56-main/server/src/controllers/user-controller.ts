import connection from "../database/connection";

export async function getSettingsFromUser(req: any, res: any) {
    try {
        const userId = req.user.id;

        const [rows] = await connection.query('SELECT start_time, end_time, start_time_weekend, end_time_weekend, automatic_notification FROM users WHERE id = ?', [userId]);
        return res.status(200).json(rows);
    } catch (error) {
        throw new Error('Server Error');
    }
}

export async function updateUserSettings(req: any, res: any) {
    const userId = req.user.id;
    const {
        start_time,
        end_time,
        start_time_weekend,
        end_time_weekend,
        automatic_notification,
    } = req.body;

    // Validate the request body
    if (start_time == null || end_time == null || automatic_notification == null || start_time_weekend == null || end_time_weekend == null) {
        return res.status(400).send('Not all required fields are provided');
    }

    //check start_time end_time and scheduled_notification is in correct format
    const timeFormat = /^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
    if (!timeFormat.test(start_time) || !timeFormat.test(end_time) || !timeFormat.test(start_time_weekend) || !timeFormat.test(end_time_weekend)) {
        return res.status(400).send('Time is not in correct format');
    }

    //check if start time is before end time format from the value is 10:00:00
    const startTime = start_time.split(':');
    const endTime = end_time.split(':');
    const startTimeWeekend = start_time_weekend.split(':');
    const endTimeWeekend = end_time_weekend.split(':');

    if (parseInt(startTime[0]) > parseInt(endTime[0]) || parseInt(startTimeWeekend[0]) > parseInt(endTimeWeekend[0])) {
        return res.status(400).send('Start time must be before end time');
    }

    if (typeof automatic_notification !== 'boolean') {
        return res.status(400).send('automatic_notification must be a boolean');
    }

    try {
        await connection.query('UPDATE users SET start_time = ?, end_time = ?,start_time_weekend = ?,end_time_weekend = ?, automatic_notification = ? WHERE id = ?', [start_time, end_time, start_time_weekend, end_time_weekend, automatic_notification, userId]);
        return res.status(204).send();
    } catch (error) {
        throw new Error('Server Error' + error);
    }
}


