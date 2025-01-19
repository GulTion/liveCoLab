import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/liveCoLab/', // Replace <repository-name> with your GitHub repository name
});
