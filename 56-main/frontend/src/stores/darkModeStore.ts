import { writable } from 'svelte/store';

function createDarkModeStore() {
    const initialValue = JSON.parse(localStorage.getItem('darkMode') || 'false');
    const store = writable(initialValue);

    store.subscribe(value => {
        localStorage.setItem('darkMode', JSON.stringify(value));
    });

    return store;
}

export const darkModeStore = createDarkModeStore();