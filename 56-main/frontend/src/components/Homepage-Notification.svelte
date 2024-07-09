<script lang="ts">
    import router from "page";
    import {delayedStartDate} from "../stores/eventStore.ts";

    export let currentNotification: Date | null;

    const acceptRecommendation = () => {
        router('/status');
        delayedStartDate.set(currentNotification);
    };
</script>

<div class="notification-container">
    {#if currentNotification}
        <span class="time">{currentNotification.getHours().toString().padStart(2, '0')}:{currentNotification.getMinutes().toString().padStart(2, '0')}</span>
        <button class="accept-button" on:click={acceptRecommendation}>Accepteren</button>
        <img class="washing-machine-icon" src="/images/washing-machine-icon.png" alt="Wasmachine">
    {/if}
</div>

<style>
    .notification-container {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 10px;
        width: 440px;
        height: 50px;
        margin-bottom: 10px;
    }

    .time {
        position: absolute;
        left: 80px;
        width: 40px;
        font-size: 40px;
        margin: 0;
        font-family: 'DigitalDisplay', sans-serif;
    }

    .accept-button {
        margin: 0;
        border: none;
        padding: 25px 50px;
        font-size: 17px;
        font-weight: bold;
        cursor: pointer;
        width: 180px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: var(--green);
    }

    .accept-button:hover {
        background-color: var(--main-button-activated);
    }

    .washing-machine-icon {
        position: absolute;
        width: 60px;
        height: 60px;
        left: 340px;
    }
</style>