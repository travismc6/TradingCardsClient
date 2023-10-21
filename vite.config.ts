import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: "../../TradingCardsApi/TradingCards/wwwroot",
  },
  server: {
    port: 3000,
  },
  plugins: [react()],
});
