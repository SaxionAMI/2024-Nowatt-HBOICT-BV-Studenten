import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0', // Ensures the server is accessible externally
    port: 5173, // The port on which your Vite server is running
  },
  plugins: [svelte()],
})
