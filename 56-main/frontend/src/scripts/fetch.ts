export async function makeRequest(endpoint: string, method:string, body: any = null){
    const token = localStorage.getItem('token');
    try {
        const options = {
            method,
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": token ? `Bearer ${token}` : ""
            },
            body: body ? JSON.stringify(body) : null,
        };
        const response = await fetch("http://localhost:3000" + endpoint, options);
        if (response.status == 204){
            return;
        }
        if (!response.ok){
            console.log(await response.json());
            throw new Error('Response error.');
        }
        return await response.json();
    } catch (e) {
        console.error(e);
        throw e;
    }
}