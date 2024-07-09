<script lang="ts">
    import { darkModeStore } from '../stores/darkModeStore.ts';
    import { onMount } from 'svelte';

    let initialLoad = true;
    let switched = true;

    onMount(() => {
        let storedDarkMode = localStorage.getItem('darkMode');
        if (storedDarkMode === null) {
            storedDarkMode = JSON.stringify(true);
            localStorage.setItem('darkMode', storedDarkMode);
        }
        const darkMode = JSON.parse(storedDarkMode);
        darkModeStore.set(darkMode);
        switched = darkMode;
        initialLoad = false;
    });

    function toggleDarkMode() {
        switched = !switched;

        darkModeStore.update(value => {
            const newValue = !value;
            localStorage.setItem('darkMode', JSON.stringify(newValue));
            return newValue;
        });
    }

    $: {
        const darkModeValue = $darkModeStore;

        if (!initialLoad) {
            document.documentElement.style.setProperty('--background-primary', darkModeValue ? '#272727' : '#FFFFFF');
            document.documentElement.style.setProperty('--background-secondary', darkModeValue ? '#3D3D3D' : '#F0F0F0');
            document.documentElement.style.setProperty('--text-primary', darkModeValue ? '#A9A9A9' : '#000000');
            document.documentElement.style.setProperty('--text-primary-hover', darkModeValue ? '#F7F7F7' : '#333333');
            document.documentElement.style.setProperty('--unselected-text', darkModeValue ? '#555555' : '#AAAAAA');
            document.documentElement.style.setProperty('--main-border', darkModeValue ? '#404040' : '#DDDDDD');
            document.documentElement.style.setProperty('--main-button', darkModeValue ? '#3E3E3E' : '#E0E0E0');
            document.documentElement.style.setProperty('--main-button-hover', darkModeValue ? '#4A4A4A' : '#D0D0D0');
            document.documentElement.style.setProperty('--main-button-activated', darkModeValue ? '#696969' : '#B0B0B0');
            document.documentElement.style.setProperty('--main-button-text', darkModeValue ? '#C5C5C5' : '#333333');
            document.documentElement.style.setProperty('--main-button-activated-text', darkModeValue ? '#FFF3F3' : '#000000');
            document.documentElement.style.setProperty('--secondary-button', darkModeValue ? '#525252' : '#DDDDDD');
        }
    }

</script>

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

<div class="switch {switched ? 'switch-on' : 'switch-off'}" on:click={toggleDarkMode}>
    <div class="slider"></div>
</div>
