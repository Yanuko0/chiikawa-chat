import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/chiikawa-chat/',
  build:{
    outDir: 'docs'
  },
  plugins: [react()],
})
