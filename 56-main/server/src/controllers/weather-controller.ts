import fs from 'fs';
import path from 'path';

export async function getWeather(req: any, res: any) {
    // When there is a API connected use this variable to get the weather data
    const city = req.params.city;

    // Define the path to the JSON file
    const filePath = path.join(__dirname, '../../data/dummy_data1.json');
    const now = new Date(); // Current date and time
    const specificDate = new Date("2024-06-11"); // Specific date
    const oneDayLater = new Date(specificDate.getTime() + 24 * 60 * 60 * 1000);
    const currentDate = specificDate.toISOString().split('T')[0];
    const currentHour = now.getHours();
    const nextDate = oneDayLater.toISOString().split('T')[0];
    console.log(currentDate, currentHour, nextDate)
    // Read the JSON file
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading file from disk: ${err}`);
            return res.status(500).send('Server error');
        } else {
            // Parse the JSON string to an object
            const jsonData = JSON.parse(data);

            let hourlyPowerValues: any[] = [];

            jsonData.filter((item: any) => {
                if (item.date === currentDate || item.date === nextDate) {
                    item.panels[0].output.hourly.forEach((panel: any) => {
                        if ((item.date === currentDate && panel.hour >= currentHour) || (item.date === nextDate && panel.hour <= currentHour)) {
                            console.log(item.date, panel.hour, currentHour)
                            hourlyPowerValues.push({
                                hour: panel.hour,
                                power: panel.clear_sky.power
                            });
                        }
                    });
                }
            });

            return res.status(200).json(hourlyPowerValues);
        }
    });
}