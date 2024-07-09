<script lang="ts">
    import { onMount } from 'svelte';
    import router from "page";
    import Home from "./pages/Home.svelte";
    import Login from "./pages/Login.svelte";
    import Device_Settings from "./pages/Device-Settings.svelte";
    import Personal_Settings from "./pages/Personal-Settings.svelte";
    import Time_Preference from "./pages/Time-Preference.svelte";
    import Washing_Mode from "./pages/Washing-Mode.svelte"
    import Status from "./pages/Status.svelte";
    import {selectedProgram, parseEvent, programData} from "./stores/eventStore.ts";
    import {makeRequest} from "./scripts/fetch.ts";

    let page;
    let currentRoute;

    const token = new URLSearchParams(window.location.search).get('token');

    if (token && !localStorage.getItem('token')) {
        localStorage.setItem('token', token);
    }

    if (localStorage.getItem('token')) {
        startListening();
        setCurrentProgram();
        setCurrentStatus();
        setProgramData();
    }

    router("/", (ctx) => {
        page = Home;
        currentRoute = ctx.pathname;
    });

    router("/login", (ctx) => {
        page = Login;
        currentRoute = ctx.pathname;
    });

    router("/device-settings", (ctx) => {
        page = Device_Settings;
        currentRoute = ctx.pathname;
    });

    router("/personal-settings", (ctx) => {
        page = Personal_Settings;
        currentRoute = ctx.pathname;
    });

    router("/time-preference", (ctx) => {
        page = Time_Preference;
        currentRoute = ctx.pathname;
    });

    router("/washing-mode", (ctx) => {
        page = Washing_Mode;
        currentRoute = ctx.pathname;
    });

    router("/status", (ctx) => {
       page = Status;
       currentRoute - ctx.pathname;
    });

    async function checkTokenAndRedirect() {
        const savedToken = localStorage.getItem('token');
        if (token !== savedToken && token !== null) {
            localStorage.setItem('token', token);
        }
        if (!savedToken && currentRoute !== '/login') {
            router.redirect('/login');
        }
    }

    async function setProgramData() {
        programData.set(await makeRequest('/home-connect/programs', 'GET'));
    }

    async function setCurrentProgram() {
        const savedToken = localStorage.getItem('token');
        const request = await fetch("http://localhost:3000/home-connect/selected-program", {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${savedToken}`,
            },
        });
        if (request.ok) {
            const response = (await request.json()).data;
            selectedProgram.set(response.key);
            localStorage.setItem("SelectedProgram", response.key);
            response.options.forEach(parseEvent);
        } else {
            console.log(await request.json());
        }
    }

    async function setCurrentStatus() {
        const savedToken = localStorage.getItem('token');
        const request = await fetch("http://localhost:3000/home-connect/status", {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${savedToken}`,
            },
        });
        if (request.ok) {
            const response = (await request.json()).data;
            response.status.forEach(parseEvent);
        }
    }


    async function startListening() {
        const savedToken = localStorage.getItem('token');
        if (savedToken) {
            const response = await fetch('http://localhost:3000/home-connect/events', {
                headers: {
                    'Authorization': `Bearer ${savedToken}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to connect to the event source');
            }

            // @ts-ignore
            const reader = response.body.getReader();
            const decoder = new TextDecoder('utf-8');

            // @ts-ignore
            reader.read().then(function processText({done, value}) {
                if (done) {
                    console.log('Stream closed');
                    return;
                }

                let buffer = decoder.decode(value, {stream: true});

                console.log("Buffer: " + buffer);
                JSON.parse(buffer.substring(6)).items.forEach(parseEvent);

                return reader.read().then(processText);
            });
        }
    }

    onMount(() => {
        router.start();
        checkTokenAndRedirect();
    });
</script>

<main>
    {#if page}
        <svelte:component this={page} />
    {:else}
        404 Not Found
    {/if}
</main>

<style>

</style>