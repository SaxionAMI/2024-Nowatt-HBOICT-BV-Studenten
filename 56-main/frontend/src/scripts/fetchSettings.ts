import {makeRequest} from "./fetch.ts";

export async function fetchSettings(){
    const data = await makeRequest('/users/settings', 'GET');
    return data;
}

export async function updateSettings(newSettings){
    try {
        await makeRequest('/users/settings', 'POST', newSettings);
    } catch (error) {
        console.error('Error posting setting:', error);
        throw error;
    }
}