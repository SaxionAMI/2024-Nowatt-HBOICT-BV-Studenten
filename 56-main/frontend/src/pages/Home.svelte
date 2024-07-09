<script lang="ts">
    import HomepageNotification from "../components/Homepage-Notification.svelte";
    import DistributionCurve from "../components/Distribution-Curve.svelte";
    import router from "page";
    import {makeRequest} from "../scripts/fetch.ts";
    import {onMount} from "svelte";

    const navigateToPersonalSettings = (): void => {
        router('/personal-settings');
    };

    const navigateToDeviceSettings = (): void => {
        router('/device-settings');
    };

    let notifications: Date[] = [];
    let currentIndex: number = 0;
    let currentNotification: Date | null = null;

    let hasNextNotification: boolean;
    let hasPreviousNotification: boolean;

    $: hasNextNotification = currentIndex < notifications.length - 1;
    $: hasPreviousNotification = currentIndex > 0;

    let currentTime: Date = new Date();
    let currentHour: number = new Date().getHours();
    const updateTime = (): void => {
        const newTime = new Date();
        const newHour = newTime.getHours();
        if (newHour !== currentHour) {
            currentHour = newHour;
            updateNotifications();
            location.reload();
        }
        currentTime = newTime;
    };
    setInterval(updateTime, 1000);

    const previousNotification = (): void => {
        if (currentIndex > 0) {
            currentIndex--;
        }
        currentNotification = new Date(notifications[currentIndex]);
        if (currentNotification < new Date()) {
            currentNotification.setDate(currentNotification.getDate() + 1);
        }
    };

    const nextNotification = (): void => {
        if (currentIndex < notifications.length - 1) {
            currentIndex++;
        }
        currentNotification = new Date(notifications[currentIndex]);
        if (currentNotification < new Date()) {
            currentNotification.setDate(currentNotification.getDate() + 1);
        }
    };

    const fetchData = async () => {
        const data = await makeRequest('/weather/Amsterdam', 'GET');
        return data;
    }

    const calculateMedian = (numbers: number[]): number => {
        const sortedNumbers = [...numbers].sort((a, b) => a - b);
        const middleIndex = Math.floor(sortedNumbers.length / 2);

        if (sortedNumbers.length % 2 === 0) {
            return (sortedNumbers[middleIndex - 1] + sortedNumbers[middleIndex]) / 2;
        } else {
            return sortedNumbers[middleIndex];
        }
    }

    const updateNotifications = async (): Promise<void> => {
        const data = await fetchData();
        const powerValues = data.map(item => item.power);
        const median = calculateMedian(powerValues);
        const notificationsData = data
            .filter(item => item.power > median)
            .map(item => {
                const date = new Date();
                date.setHours(item.hour, 0, 0, 0);
                return {
                    date,
                    power: item.power
                };
            })
            .sort((a, b) => b.power - a.power);

        notifications = notificationsData.map(item => item.date);

        currentIndex = 0;
        currentNotification = notifications[currentIndex];
        if (currentNotification < new Date()) {
            currentNotification.setDate(currentNotification.getDate() + 1);
        }
    }

    onMount(updateNotifications);
</script>

<div class="container">
    <header>
        <span class="clock">{currentTime.getHours().toString().padStart(2, '0')}:{currentTime.getMinutes().toString().padStart(2, '0')}</span>
        <button class="user-button" on:click={navigateToPersonalSettings}>
            <img src="/images/user-icon.png" alt="User">
        </button>
        <button class="settings-button" on:click={navigateToDeviceSettings}>
            <img src="/images/settings-icon.png" alt="Settings">
        </button>
    </header>

    {#if currentNotification}
        <DistributionCurve {currentNotification}/>
    {/if}

    {#if localStorage.getItem('notifications') === 'true'}
        <div class="notification-container">
            <button class="arrow-button left-arrow {hasPreviousNotification ? '' : 'hidden'}"
                    on:click={previousNotification}>
                <img src="images/arrow-left-icon.png" alt="Arrow Left">
            </button>
            <HomepageNotification {currentNotification}/>
            <button class="arrow-button right-arrow {hasNextNotification ? '' : 'hidden'}" on:click={nextNotification}>
                <img src="images/arrow-right-icon.png" alt="Arrow Right">
            </button>
        </div>
    {/if}
</div>

<style>
    @font-face {
        font-family: 'DigitalDisplay';
        src: url('/fonts/digital display tfb.ttf');
    }

    .container {
        background-color: var(--background-primary);
        color: var(--text-primary);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 464px;
        width: 472px;
    }

    .notification-container {
        background-color: var(--background-secondary);
        width: 440px;
        height: 70px;
        margin-bottom: 10px;
        display: flex;
    }

    header {
        width: 100%;
        height: 80px;
        display: flex;
        justify-content: space-between;
        position: relative;
        top: 0;
        left: 0;
        margin-bottom: 100px;
    }

    .user-button {
        position: absolute;
        right: 80px;
        top: 10px;
        border: none;
        cursor: pointer;
        background: transparent;
    }

    .settings-button {
        position: absolute;
        right: 10px;
        top: 10px;
        border: none;
        cursor: pointer;
        background: transparent;
    }

    .user-button img, .settings-button img {
        width: 50px;
        height: 50px;
    }

    .user-button:hover, .settings-button img:hover {
        transform: scale(1.1);
    }

    .clock {
        font-size: 60px;
        font-family: 'DigitalDisplay', sans-serif;
        letter-spacing: 2px;
        position: absolute;
        left: 25px;
    }

    .arrow-button {
        position: relative;
        background: transparent;
        border: none;
        cursor: pointer;
    }

    .arrow-button img {
        width: 50px;
        height: 50px;
    }

    .arrow-button:hover {
        transform: scale(110%);
    }

    .hidden {
        visibility: hidden;
    }
</style>