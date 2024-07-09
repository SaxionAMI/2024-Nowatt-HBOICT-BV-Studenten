<script>
    export let value = 0;
    export let setValue = (newValue) => {};

    const increment = () => {
        if (value < 1440) {
            setValue(value + 30);
        }
    }

    const decrement = () => {
        if (value > 0) {
            setValue(value - 30);
        }
    }

    function minutesToTime(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    }
</script>

<button class="button-decrement" on:click={decrement}>-</button>
<div class="readonly-input">{minutesToTime(value)}</div>
<button class="button-increment" on:click={increment}>+</button>
<style>

    .readonly-input {
        font-size: 24px;
        width: 70px;
        height: 70px;
        background-color: var(--secondary-button);
        margin-top: 5px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: var(--main-button-text);
    }

    button {
        font-size: 24px;
        border: none;
        margin-top: 5px;
        width: 45px;
        height: 70px;
        background-color: var(--secondary-button);
        color: var(--main-button-text);
        cursor: pointer;
    }

    .button-increment {
        border-left: 2px solid var(--background-secondary);
        margin-right: 10px;
    }

    .button-decrement {
        border-right: 2px solid var(--background-secondary);
        margin-left: 10px;
    }


    button:hover {
        background-color: var(--main-button-hover);
    }
</style>