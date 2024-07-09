<script lang="ts">
    import {programData, selectedProgram, spinSpeed, temperature, trim} from '../stores/eventStore.ts';

    const toggleDevice = (value) => {
        if (value.includes("Temperature")) {
            localStorage.setItem('Temperature', value)
            temperature.set(value);
        } else if (value.includes("SpinSpeed")) {
            localStorage.setItem('SpinSpeed', value)
            spinSpeed.set(value);
        }
    }
    console.log($programData);
    console.log($programData.find(program => program.key === $selectedProgram));
</script>

{#if $selectedProgram}
    <div class="program-settings">
        {#each $programData.find(program => program.key === $selectedProgram).options as option (option.key)}
            <div class="option">
                <h3>{option.key.replace("LaundryCare.Washer.Option.Temperature", "Temperatuur").replace("LaundryCare.Washer.Option.SpinSpeed", "Toeren (RPM)")}</h3>
                {#each option.constraints.allowedvalues as value (value)}
                    <button class="option-item {(trim(value) === trim($temperature) || trim(value) === trim($spinSpeed)) ? 'highlight' : ''}"
                            on:click={() => toggleDevice(value)}>
                        {trim(value)}
                    </button>
                {/each}
            </div>
        {/each}
    </div>
{:else}
    <div class="program-settings">
        <h1>Geen wasprogramma geselecteerd!</h1>
    </div>
{/if}

<style>
    h1 {
        text-align: center;
        font-size: 20px;
    }

    h3 {
        margin: 15px 0 5px 0;
        font-size: 22px;
    }

    .program-settings {
        height: 375px;
        width: 250px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
    }

    .option {
        text-align: center;
    }

    .option-item {
        margin: 5px 5px 5px 5px;
        border: none;
        border-radius: 5px;
        background-color: var(--secondary-button);
        color: var(--main-button-text);
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 20px;
        transition-duration: 0.4s;
        width: calc(30% - 10px);
        height: 40px;
    }

    .option-item:hover {
        background-color: var(--main-button-hover);
    }

    .option-item.highlight {
        background-color: var(--main-button-activated-text);
        color: var(--main-button-activated);
    }

</style>