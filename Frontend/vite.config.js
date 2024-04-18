import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server:{
    proxy:{
      '/api':'https://note-app-server-git-main-codebykarans-projects.vercel.app'
    }
  },
  plugins: [react()],
})
