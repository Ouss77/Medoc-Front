import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     host: '0.0.0.0',
//     port: 3000,
//   },
// });

export default defineConfig({
  plugins: [react()],
  server: {
    host: "localhost", // Change this line
    port: 3000,
  },
  build: {
    rollupOptions: {
      external: ["papaparse", "react-datepicker"],
    },
  },
});
