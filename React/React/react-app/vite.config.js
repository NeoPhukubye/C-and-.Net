// Import the official React plugin that adds JSX support and fast refresh.
import react from "@vitejs/plugin-react";
// Import the helper that provides type hints and default settings.
import { defineConfig } from "vite";

// Export the Vite configuration object.
export default defineConfig({
  // Enable the React plugin.
  plugins: [react()],
  // Development server settings.
  server: {
    // Pin the port so the API CORS policy and browser URLs stay stable.
    port: 5173,
    // Forward API calls to the ASP.NET Core project while developing.
    proxy: {
      // Any request starting with /api is forwarded to the backend.
      "/api": {
        // Address of the WebApplication1 project.
        target: "http://localhost:5159",
        // Rewrite the Host header so the backend accepts the request.
        changeOrigin: true,
      },
    },
  },
});
