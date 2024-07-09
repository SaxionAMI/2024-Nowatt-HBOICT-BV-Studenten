<script>
    import router from "page";
    import WashingModeButtons from "../components/Washing-Mode-Buttons.svelte";
    import {programData, selectedProgram, spinSpeed, temperature, trim} from '../stores/eventStore.ts';

    async function selectProgram() {
        fetch("http://localhost:3000/home-connect/selected-program", {
            method: "PUT",
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

    const toggleDevice = (programKey) => {
        const cleanedProgramKey = programKey.replace("LaundryCare.Washer.Program.", "");
        localStorage.setItem('SelectedProgram', cleanedProgramKey);
        selectedProgram.set(programKey);

        const temperatureOptions = $programData.find(program => program.key === $selectedProgram).options
            .find(option => option.key == "LaundryCare.Washer.Option.Temperature").constraints.allowedvalues,
            spinSpeedOptions = $programData.find(program => program.key === $selectedProgram).options
                .find(option => option.key == "LaundryCare.Washer.Option.SpinSpeed").constraints.allowedvalues;
        if (temperatureOptions.find(constraint => constraint === $temperature) == null) {
            temperature.set(temperatureOptions[0]);
        }
        if (spinSpeedOptions.find(constraint => constraint === $spinSpeed) == null) {
            spinSpeed.set(spinSpeedOptions[0]);
        }
    }

    const routeDeviceSettingsPage = () => {
        selectProgram();
        router('/device-settings');
    }

</script>

<main>
    <div class="container">
        <header>
            <button class="back-button" on:click={routeDeviceSettingsPage}>
                <img class="back-icon" src="/images/back-icon.png" alt="back">
            </button>
            <h1>Was Instellingen</h1>
        </header>
        <div class="washing-mode item-container">
            <div class="programs">
                <h2>Was Programma</h2>
                <ul class="program-list">
                    {#each $programData as program (program.key)}
                        <button class="program-item"
                                class:highlight={$selectedProgram === program.key}
                                on:click={() => toggleDevice(program.key)}>
                            {trim(program.key)}
                        </button>
                    {/each}
                </ul>
            </div>
            <div class="wash-settings">
                <WashingModeButtons/>
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

    .washing-mode {
        height: 400px;
        display: flex;
        flex-direction: row;
    }

    .washing-mode {
        width: 150px;
        border-right: 7px solid var(--main-border);
    }

    .programs {
        width: 150px;
        border-right: 7px solid var(--main-border);
    }

    .programs h2::after {
        content: "";
        display: block;
        border-top: 5px solid var(--background-primary);
        width: calc(100% - 20px);
        margin: 10px auto;
    }

    .program-list {
        list-style-type: none;
        padding: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .program-item {
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

    .program-item.highlight {
        color: var(--main-button-activated-text);
    }

    .wash-settings {
        width: 250px;
    }

    .item-container {
        width: 400px;
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