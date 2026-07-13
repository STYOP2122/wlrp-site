import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { sampStatusPlugin } from './server/sampApiPlugin.js'

/** GitHub Pages project site: https://STYOP2122.github.io/wlrp-site/ */
const base = process.env.GITHUB_PAGES === 'true' ? '/wlrp-site/' : '/'

export default defineConfig({
  base,
  plugins: [vue(), sampStatusPlugin()],
  publicDir: 'public',
  server: {
    port: 5173,
    open: true,
  },
})
