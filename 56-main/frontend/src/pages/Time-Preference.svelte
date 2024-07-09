<script>
    import router from "page";
    import TimeInput from '../components/TimeInput.svelte';
    import {fetchSettings, updateSettings} from '../scripts/fetchSettings.ts';
    import {onMount} from "svelte";

    let vanWeekday = 720;
    let totWeekday = 1080;
    let vanWeekend = 600;
    let totWeekend = 1140;

    let settings;

    const routePersonalSettingsPage = () => {
        changeSettings();
        router('/personal-settings');
    }

    function formatTime(hours, minutes) {
        let formattedHours = hours.toString().padStart(2, '0');
        let formattedMinutes = minutes.toString().padStart(2, '0');

        return `${formattedHours}:${formattedMinutes}:00`;
    }

    function convertTimeToMinutes(timeString) {
        let parts = timeString.split(':');
        let hours = parseInt(parts[0]);
        let minutes = parseInt(parts[1]);
        return hours * 60 + minutes;
    }

    onMount(async () => {
        const data = await fetchSettings();
        if (data.length > 0) {
            const settings = data[0];
            vanWeekday = convertTimeToMinutes(settings.start_time);
            totWeekday = convertTimeToMinutes(settings.end_time);
            vanWeekend = convertTimeToMinutes(settings.start_time_weekend);
            totWeekend = convertTimeToMinutes(settings.end_time_weekend);

            localStorage.setItem('start_time', JSON.stringify(vanWeekday));
            localStorage.setItem('end_time', JSON.stringify(totWeekday));
            localStorage.setItem('start_time_weekend', JSON.stringify(vanWeekend));
            localStorage.setItem('end_time_weekend', JSON.stringify(totWeekend));
        }
    });

    async function changeSettings() {
        try {
            const updatedSettings = {
                start_time: formatTime(Math.floor(vanWeekday / 60), vanWeekday % 60),
                end_time: formatTime(Math.floor(totWeekday / 60), totWeekday % 60),
                start_time_weekend: formatTime(Math.floor(vanWeekend / 60), vanWeekend % 60),
                end_time_weekend: formatTime(Math.floor(totWeekend / 60), totWeekend % 60),
                automatic_notification: localStorage.getItem('notifications') === "true",
                scheduled_notification: "18:00:00"
            };
            await updateSettings(updatedSettings);

        } catch (error) {
            console.error("Error saving changes:", error);
        }
    }

</script>

<main>
    <div class="container">
        <header>
            <button class="back-button" on:click={routePersonalSettingsPage}>
                <img class="back-icon" src="/images/back-icon.png" alt="back">
            </button>
            <h1>Tijdsinstellingen</h1>
        </header>
        <div class="weekday item-container">
            <h2>Weekdag</h2>
            <div class="text-labels">
                <label for="van">Van</label>
                <label for="tot">Tot</label>
            </div>
            <div class="time-input-box">
                <TimeInput value={vanWeekday} setValue={(newValue) => vanWeekday = newValue} />
                <TimeInput value={totWeekday} setValue={(newValue) => totWeekday = newValue} />

            </div>
        </div>
        <div class="weekend item-container">
            <h2>Weekend</h2>
            <div class="text-labels">
                <label for="van">Van</label>
                <label for="tot">Tot</label>
            </div>
            <div class="time-input-box">
                <TimeInput value={vanWeekend} setValue={(newValue) => vanWeekend = newValue} />
                <TimeInput value={totWeekend} setValue={(newValue) => totWeekend = newValue} />
            </div>
        </div>
    </div>
</main>
<style>


    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 464px;
        width: 472px;
        background-color: var(--background-primary);
        color: var(--text-primary);
    }

    header {
        width: 100%;
        height: 85px;
        display: flex;
        justify-content: space-between;
        position: relative;
    }

    h1 {
        margin: 0;
        padding: 0;
        top: 25px;
        left: 80px;
        right: 80px;
        font-size: 27px;
        text-align: center;
        position: absolute;
    }

    h2 {
        margin-top: 5px;
        margin-bottom: 0;
        padding: 0;
        font-size: 24px;
    }

    label {
        margin-left: 75px;
        margin-right: 80px;
        font-size: 20px;
    }

    .item-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 360px;
        background-color: var(--background-secondary);
        margin-bottom: 30px;
        border: 7px solid var(--main-border);
    }

    .text-labels, .time-input-box {
        display: flex;
        justify-content: space-between;
        width: 100%;
    }

    .time-input-box {
        display: flex;
        justify-content: space-between;
        width: 100%;
    }


    .weekday {
        height: 138px;
    }

    .weekend {
        height: 138px;
    }

    button:hover {
        background-color: var(--main-button-hover);
    }

    .back-icon {
        position: absolute;
        right: 10px;
        top: 3px;
        border: none;
        cursor: pointer;
        width: 50px;
    }

    .back-button {
        background: transparent;
        border: none;
        outline: none;
    }

    .back-icon:hover {
        transform: scale(1.1);
    }
</style>