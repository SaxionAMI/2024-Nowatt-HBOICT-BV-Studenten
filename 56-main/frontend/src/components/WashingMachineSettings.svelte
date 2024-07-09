<script>
    import Switch from "../components/NotificationSwitch.svelte";
    import router from "page";
    import {selectedProgram, spinSpeed, temperature, trim} from "../stores/eventStore.ts";

    const routeWashingMachineModesPage = () => {
        router('/washing-mode');
    }

    const routeStatusPage = () => {
        router('/status');
    }

</script>

<h2>Automatische Modus</h2>
<div class="switch-container">
    <Switch/>
</div>
<div class="line"></div>
<div class="was-modus-box">
    <div class="was-modus-item">{trim($selectedProgram)}</div>
    <div class="was-modus-item">{trim($spinSpeed)}</div>
    <div class="was-modus-item">{trim($temperature)}</div>
</div>
<button class="change-button" on:click={routeWashingMachineModesPage}>Pas aan</button>
<div class="line"></div>
<h2>Wasmachine Status</h2>
<button class="change-button" on:click={routeStatusPage}>Bekijk Status</button>


<style>
    h2 {
        margin-top: 5px;
        margin-bottom: 0;
        padding: 0;
        font-size: 19px;
        text-align: center;
    }

    .switch-container {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 5px 0 10px 0;
    }

    .line {
        border-top: 5px solid var(--background-primary);
        width: calc(100% - 20px);
        margin: 20px 10px 10px 10px
    }

    .change-button {
        font-size: 18px;
        height: 30px;
        border: none;
        margin: 7px 0 0 10px;
        width: 170px;
        background-color: var(--secondary-button);
        color: var(--main-button-text);
        cursor: pointer;
    }


    .was-modus-box {
        margin: 5px 30px 5px 30px;
    }

    .was-modus-item {
        padding: 5px 0 5px 0;
        background-color: var(--secondary-button);
        color: var(--main-button-text);
        margin: 5px 0 5px 0;
        text-align: center;
        font-size: 18px;
    }
</style>