import {writable} from "svelte/store";
import {makeRequest} from "../scripts/fetch.ts";

// @ts-ignore
export function parseEvent(event) {
    let key = trim(event.key);
    localStorage.setItem(key, event.value);

    switch (key) {
        case 'OperationState':
            operationState.set(event.value);
            break;
        case 'SpinSpeed':
            spinSpeed.set(event.value);
            break;
        case 'ActiveProgram':
            activeProgram.set(event.value);
            break;
        case 'SelectedProgram':
            selectedProgram.set(event.value);
            break;
        case 'RemainingProgramTime':
            remainingProgramTime.set(event.value);
            break;
        case 'Temperature':
            temperature.set(event.value);
            break;
        case 'ProgramProgress':
            programProgress.set(event.value);
            break;
        case 'DoorState':
            doorState.set(event.value);
            break;
        case 'RemoteControlStartAllowed':
            remoteControlStartAllowed.set(event.value);
            break;
    }
}

export function trim(string: string) {
    let parts = string.split(".");
    let part = parts[parts.length - 1];
    if (part.includes("GC")) {
        return part.substring(2) + ' °C';
    } else if (part.includes("RPM")) {
        return part.substring(3);
    }
    return part;
}

export const operationState = writable(localStorage.getItem('OperationState'));
export const spinSpeed = writable(localStorage.getItem('SpinSpeed'));
export const activeProgram = writable(localStorage.getItem('ActiveProgram'));
export const selectedProgram = writable(localStorage.getItem('SelectedProgram'));
export const remainingProgramTime = writable(localStorage.getItem('RemainingProgramTime'));
export const temperature = writable(localStorage.getItem('Temperature'));
export const programProgress = writable(localStorage.getItem('ProgramProgress'));
export const doorState = writable(localStorage.getItem('DoorState'));
export const remoteControlStartAllowed = writable(localStorage.getItem('RemoteControlStartAllowed'));
export const delayedStartDate = writable(new Date());
export const programData = writable();