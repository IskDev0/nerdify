import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
    base: '/nerdify/',
    plugins: [
        vue(),
        tailwindcss(),
        VitePWA({
            registerType: 'autoUpdate',
            devOptions: {
                enabled: true,
            },
            manifest: {
                name: 'Nerdify',
                short_name: 'Nerdify',
                description: 'Nerdify text lmao',
                theme_color: '#be9851',
                background_color: '#ffffff',
                display: 'standalone',
                start_url: '.',
                icons: [
                    {
                        src: '/icons/android-icon-192x192.png',
                        sizes: '192x192',
                        type: 'image/png',
                    },
                    {
                        src: '/icons/android-icon-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                    }
                ]
            }
        })
    ],
})
