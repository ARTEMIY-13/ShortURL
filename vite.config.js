import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// На GitHub Pages сайт живе за адресою /ShortURL/. Для іншого шляху: BASE_PATH=/ npm run build
export default defineConfig({
  base: process.env.BASE_PATH ?? '/ShortURL/',
  plugins: [react()],
  server: { proxy: { '/api': 'http://localhost:3001' } },
})
