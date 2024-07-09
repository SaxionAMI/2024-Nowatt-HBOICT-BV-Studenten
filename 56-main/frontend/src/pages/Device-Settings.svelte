<script>
    import router from "page";
    import Switch from "../components/NotificationSwitch.svelte";
    import WashingMachineSettings from "../components/WashingMachineSettings.svelte";
    import {onMount} from "svelte";

    let selectedDevice = 'wasmachine';

    const toggleDevice = (deviceName) => {
        selectedDevice = deviceName;
        localStorage.setItem('selectedDevice', deviceName); // Store the selected device in local storage
    }

    const routeHomePage = () => {
        router('/');
    }

    onMount(() => {
        const storedDevice = localStorage.getItem('selectedDevice');
        if (storedDevice) {
            selectedDevice = storedDevice;
        }
    });
</script>

<main>
    <div class="container">
        <header>
            <button class="back-button" on:click={routeHomePage}>
                <img class="back-icon" src="/images/back-icon.png" alt="back">
            </button>
            <h1>Device Instellingen</h1>
        </header>
        <div class="device-settings item-container">
            <div class="devices">
                <h2>Apparaten</h2>
                <ul class="device-list">
                    <button class="device-item" class:highlight={selectedDevice === 'wasmachine'}
                            on:click={() => toggleDevice('wasmachine')}>Wasmachine
                    </button>
                    <button class="device-item" class:highlight={selectedDevice === 'droger'}
                            on:click={() => toggleDevice('droger')}>Droger
                    </button>
                </ul>
            </div>
            <div class="settings">
                {#if selectedDevice === 'wasmachine'}
                    <WashingMachineSettings/>
                {/if}
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
        height: 52px;
        display: flex;
        justify-content: space-between;
        position: relative;
    }

    h1 {
        margin: 0;
        padding: 0;
        top: 5px;
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
        font-size: 22px;
        text-align: center;
    }

    .device-settings {
        height: 400px;
        display: flex;
        flex-direction: row;
    }

    .devices {
        width: 150px;
        border-right: 7px solid var(--main-border);
    }

    .devices h2::after {
        content: "";
        display: block;
        border-top: 5px solid var(--background-primary);
        width: calc(100% - 20px);
        margin: 10px auto;
    }

    .device-list {
        list-style-type: none;
        padding: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .device-item {
        cursor: pointer;
        text-align: center;
        padding-bottom: 10px;
        color: var(--text-primary);
        font-weight: bold;
        background: none;
        border: none;
        outline: none;
        font-size: 20px;
    }

    .device-item.highlight {
        color: var(--main-button-activated-text);
    }

    .settings {
        width: 230px;
    }

    .item-container {
        width: 320px;
        background-color: var(--background-secondary);
        margin-bottom: 15px;
        border: 7px solid var(--main-border);
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