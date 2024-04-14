//import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  cachedChecks: false,
  plugins: [
    vue()
  ],
  //problem with ckeditor5
  // resolve: {
  //   alias: {
  //     '@':  fileURLToPath(new URL('./src', import.meta.url)),
  //     test: fileURLToPath(new URL('./test', import.meta.url))
  //   }
  // },
  server: {
    fs: {
      cachedChecks: false
    },    
    proxy: {
      '/api': 'http://localhost:8000',
      '/images': 'http://localhost:8000'
    }
  }
})

//console.log('load main config');
