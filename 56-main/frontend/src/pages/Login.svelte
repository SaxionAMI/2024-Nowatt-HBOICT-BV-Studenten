<script>
    import router from "page";

   function navigateToHomeConnect() {
       window.location.href = 'https://simulator.home-connect.com/security/oauth/authorize?response_type=code&client_id=0ED458A20BC8727764E3BCAD38FFD5631C881B326EF32593DD95366B58B23234&scope=IdentifyAppliance%20Control%20Settings%20Monitor&redirect_uri=http://localhost:3000/home-connect/authorize'
   }
</script>

<main>
    <h1>NOWATT</h1>
    <button on:click={navigateToHomeConnect}>
        Verbinden met HomeConnect
    </button>
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 480px;
        height: 480px;
        background-color: var(--background-primary);
        color: var(--text-primary);
        padding: 20px;
        box-sizing: border-box;
        border-radius: 10px;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    }

    h1, h2 {
        text-align: center;
    }

    button {
        margin-top: 1rem;
        padding: 1rem 4rem;
        border: none;
        background-image: linear-gradient(to bottom right, #375EE7, #5CC5FE);
        color: white;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        font-size: 20px;
        border-radius: 5px;
        transition: background-color 0.3s ease;
    }

    button:hover {
        background-image: linear-gradient(to top left, #2C47B2, #4A8FD2);
    }

    img {
        order: 1;
        width: 40px;
        height: 40px;
    }
</style>