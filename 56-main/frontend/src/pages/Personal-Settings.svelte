<script>
    import router from "page";
    import Switch from "../components/NotificationSwitch.svelte";
    import DarkModeSwitch from "../components/DarkModeSwitch.svelte"
    import {onMount} from "svelte";
    import {fetchSettings, updateSettings} from "../scripts/fetchSettings.ts";

    const changeAccount = () => {
        if (localStorage.getItem('token')) {
            localStorage.removeItem('token');
            router('/login');
        }
    }

    onMount(async () => {
        const data = await fetchSettings();
        if (data.length > 0) {
            const settings = data[0];
            const automaticNotification = settings.automatic_notification === "true";
            const scheduledNotification = settings.scheduled_notification;

            localStorage.setItem('automatic_notification', JSON.stringify(automaticNotification));
            localStorage.setItem('scheduled_notification', JSON.stringify(scheduledNotification));
        }
    });

    function formatTime(time) {
        let hours = Math.floor(time / 60);
        let minutes = time % 60;
        let formattedHours = hours.toString().padStart(2, '0');
        let formattedMinutes = minutes.toString().padStart(2, '0');

        return `${formattedHours}:${formattedMinutes}:00`;
    }

    async function changeSettings() {
        try {
            const updatedSettings = {
                start_time: formatTime(localStorage.getItem('start_time')),
                end_time: formatTime(localStorage.getItem('end_time')),
                start_time_weekend: formatTime(localStorage.getItem('start_time_weekend')),
                end_time_weekend: formatTime(localStorage.getItem('end_time_weekend')),
                automatic_notification: localStorage.getItem('notifications') === "true",
                scheduled_notification: "18:00:00"
            };
            await updateSettings(updatedSettings);

        } catch (error) {
            console.error("Error saving changes:", error);
        }
    }

    const routeHomePage = () => {
        changeSettings()
        router('/');
    }

    const routeTimePreferencePage = () => {
        router('/time-preference');
    }
</script>

<main>
    <div class="container">
        <header>
            <button class="back-button" on:click={routeHomePage}>
                <img class="back-icon" src="/images/back-icon.png" alt="back">
            </button>
            <h1>Persoonlijke Instellingen</h1>
        </header>
        <div class="personal-data item-container">
            <h2>Persoonlijke Gegevens</h2>
            <button class="change-button" on:click={changeAccount}>Verander Account</button>
        </div>
        <div class="time-preference item-container">
            <h2>Voorkeur Tijd</h2>
            <button class="change-button" on:click={routeTimePreferencePage}>Pas aan</button>
        </div>
        <div class="notifications item-container">
            <div class="switch-text">
                <h2>Notificaties</h2>
                <h2>Dark mode</h2>
            </div>
            <div class="switches">
                <Switch/>
                <DarkModeSwitch/>
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
        font-size: 26px;
        text-align: center;
        position: absolute;
    }

    h2 {
        margin-top: 5px;
        margin-bottom: 0;
        padding: 0;
        font-size: 18px;
    }

    .item-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 320px;
        background-color: var(--background-secondary);
        margin-bottom: 15px;
        border: 7px solid var(--main-border);
    }

    .personal-data {
        height: 90px;
    }

    .time-preference {
        height: 90px;
    }

    .notifications {
        height: 90px;
    }

    .change-button {
        height: 40px;
        border: none;
        margin: 5px 0 10px 0;
        width: 170px;
        background-color: var(--secondary-button);
        color: var(--main-button-text);
        cursor: pointer;
        font-size: 18px;
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

    .switch-text {
        display: flex;
        justify-content: space-between;
        width: 225px;
    }

    .switches {
        display: flex;
        justify-content: space-between;
        width: 225px;
    }
</style>