<script lang="ts">
    import { onMount } from 'svelte';

    let switched = false;

    onMount(() => {
        const storedValue = localStorage.getItem('notifications');
        switched = storedValue === 'true';
    });

    const toggle = () => {
        switched = !switched;
        localStorage.setItem('notifications', String(switched));
    }

    const handleKeydown = (event: KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
            toggle();
            event.preventDefault();
        }
    }
</script>

<div class="switch {switched ? 'switch-on' : 'switch-off'}"
     on:click={toggle}
     on:keydown={handleKeydown}
     tabindex="0"
     role="button">
    <div class="slider"></div>
</div>

<style>
    .switch {
        margin-top: 10px;
        width: 80px;
        height: 34px;
        position: relative;
        display: inline-block;
        border-radius: 34px;
        background-color: #ccc;
        transition: background-color 0.2s;
    }

    .switch-on {
        background-color: #4CAF50;
    }

    .slider {
        position: absolute;
        width: 30px;
        top: 2px;
        left: 2px;
        right: 2px;
        bottom: 2px;
        background-color: #fff;
        border-radius: 30px;
        transition: transform 0.2s;
    }

    .switch-on .slider {
        transform: translateX(46px);
    }
</style>