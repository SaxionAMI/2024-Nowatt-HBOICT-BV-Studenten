<script>
    import router from "page";
    import {
        spinSpeed,
        selectedProgram,
        doorState,
        operationState,
        programProgress,
        remainingProgramTime,
        temperature, remoteControlStartAllowed, trim, delayedStartDate
    } from "../stores/eventStore.ts";
    import TimeInput from "../components/TimeInput.svelte";

    let interval, delay = $delayedStartDate.getHours() * 60 + $delayedStartDate.getMinutes(), formattedTime = "";

    const routeDeviceSettingsPage = () => {
        router('/device-settings');
    }

    function formatTime(timeLeft) {
        console.log(timeLeft);
        const hours = Math.floor(timeLeft / 60 / 60);
        const minutes = Math.floor(timeLeft / 60 % 60);
        return `${hours}u, ${minutes}min`;
    }

    function minutesToTime(seconds) {
        seconds = Math.floor(seconds);
        const hours = Math.floor(seconds / 60);
        const mins = Math.floor(seconds % 60);
        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    }

    async function startProgram() {
        fetch("http://localhost:3000/home-connect/start", {
            method: "POST",
            headers: {
                Authorization: localStorage.getItem("token"),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    data: {
                        "key": $selectedProgram,
                        "options": [
                            {
                                "key": "LaundryCare.Washer.Option.Temperature",
                                "value": $temperature
                            },
                            {
                                "key": "LaundryCare.Washer.Option.SpinSpeed",
                                "value": $spinSpeed
                            }
                        ]
                    }
                }
            )
        });
    }

    function delayedStart() {
        const currentDate = new Date().getHours() * 60 + new Date().getMinutes();
        if (currentDate > delay) {
            clearInterval();
            startProgram();
        } else {
            formattedTime = "Tijd tot wassen: " + minutesToTime(delay - currentDate);
        }
    }

    function clearInterval() {
        formattedTime = ""
        clearTimeout(interval);
    }

    function stopProgram() {
        fetch("http://localhost:3000/home-connect/active-program", {
            method: "DELETE",
            headers: {
                Authorization: localStorage.getItem("token"),
                'Content-Type': 'application/json'
            }
        });
    }

</script>

<main>
    <div class="container">
        <header>
            <button class="back-button" on:click={routeDeviceSettingsPage}>
                <img class="back-icon" src="/images/back-icon.png" alt="back">
            </button>
            <h1>Wasmachine Status</h1>
        </header>
        <div class="washing-mode item-container">
            <div class="status">

                {#if $operationState === "BSH.Common.EnumType.OperationState.Inactive"}
                    <h2>Status: Washmachine staat uit. Zet deze aan om te kunnen wassen</h2>
                {:else if $operationState === "BSH.Common.EnumType.OperationState.Ready"}
                    <h2>Status: Klaar om te wassen</h2>
                    {#if trim($doorState) === "Open"}
                        <h2>Doe de deur dicht om te kunnen wassen</h2>
                    {:else}
                        <div class="line"></div>
                        {#if $remoteControlStartAllowed === false}
                            <h2>Zet remote start aan op de wasmachine om te kunnen wassen met nowatt</h2>
                        {:else}
                            <h2>Geselecteerde opties:</h2>
                            <h2>Programma: {trim($selectedProgram)}</h2>
                            <h2>Draai Snelheid: {trim($spinSpeed)}</h2>
                            <h2>Temperatuur: {trim($temperature)}</h2>
                            <div class="button-container">
                                <button class="control-button" on:click={() => {router("/washing-mode")}}>Pas programma
                                    aan
                                </button>
                                <button class="control-button" id="play-button" on:click={startProgram}>
                                    <img src="../../public/images/play-icon.png" alt="Play">
                                </button>
                            </div>
                            <div class=line></div>
                            <div class="button-container">
                                <div class="time-input-box">
                                    <TimeInput
                                            value={delay}
                                            setValue={newvalue => delay = newvalue}/>
                                </div>
                                <div class="timer">{formattedTime || 'Geen automatische starttijd'}</div>
                            </div>
                            <div class="button-container">
                                <button class="control-button" id="delayed-start-button"
                                        on:click={() =>  {clearTimeout(interval);interval = setInterval(delayedStart, 1000); }}>
                                    Stel automatische starttijd in
                                </button>
                                <button class="control-button" id="stop-button" on:click={clearInterval}>Verwijder
                                    ingestelde tijd
                                </button>
                            </div>
                        {/if}
                    {/if}
                {:else if $operationState === "BSH.Common.EnumType.OperationState.Run"}
                        <h2>Status: Actief een was aan het doen</h2>
                        <div class="line"></div>
                        <h2>Programma: {trim($selectedProgram)}</h2>
                        <h2>Spin Snelheid (RPM): {trim($spinSpeed)}</h2>
                        <h2>Temperatuur: {trim($temperature)}</h2>
                        <div class="line"></div>
                        <h2>Resterende tijd: {formatTime($remainingProgramTime)}</h2>
                        <h2>Voortgang: {$programProgress}%</h2>
                        <!--                    <button class="control-button" id="pause-button" on:click={pauseProgram}>-->
                        <!--                        <img src="../../public/images/pause-icon.png" alt="Pause">-->
                        <!--                    </button>-->
                        <div class="stop-button-container">
                            <button class="control-button" on:click={stopProgram}>
                                <img src="../../public/images/stop-icon.png" alt="Stop">
                            </button>
                        </div>
                {:else if $operationState === "BSH.Common.EnumType.OperationState.ActionRequired"}
                    <h2>Status: Je wasmachine vereist een actie. Check de wasmachine</h2>
                {:else if $operationState === "BSH.Common.EnumType.OperationState.Finished"}
                    <h2>Status: Je was is klaar</h2>
                {:else if $operationState === "BSH.Common.EnumType.OperationState.Error"}
                    <h2>Status: Je wachmachine heeft een error. Check deze op de wacmachine</h2>
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
        top: 15px;
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
        font-size: 21px;
        text-align: center;
    }

    .line {
        border-top: 5px solid var(--background-primary);
        width: calc(100% - 20px);
        margin: 10px 10px 10px 10px
    }

    .washing-mode {
        height: 400px;
        display: flex;
        flex-direction: row;
    }

    .washing-mode {
        width: 150px;
        border-right: 7px solid var(--main-border);
    }

    .status {
        width: 400px;
        border-right: 7px solid var(--main-border);
    }

    .programs h2::after {
        content: "";
        display: block;
        border-top: 5px solid var(--background-primary);
        width: calc(100% - 20px);
        margin: 10px auto;
    }

    .item-container {
        width: 400px;
        background-color: var(--background-secondary);
        margin-bottom: 5px;
        border: 7px solid var(--main-border);
    }

    .button-container {
        width: 400px;
        display: flex;
        margin-left: 24px;
    }

    .control-button {
        height: 40px;
        border: none;
        margin: 7px;
        width: 162px;
        font-size: 16px;
        font-weight: bold;
        background-color: var(--secondary-button);
        color: var(--main-button-text);
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
    }

    .control-button img {
        width: 35px;
        height: 35px;
    }

    .stop-button-container {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 15px;
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

    .time-input-box {
        margin-bottom: 10px;
        display: flex;
        justify-content: left;
        width: 182px;
    }

    .timer {
        margin-bottom: 10px;
        margin-top: 5px;
        font-size: 20px;
        font-weight: bold;
        height: 70px;
        width: 162px;
        background-color: var(--secondary-button);
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
    }

    #delayed-start-button {

    }

</style>