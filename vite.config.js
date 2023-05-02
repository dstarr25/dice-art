import eslint from 'vite-plugin-eslint';
import vitePluginFaviconsInject from 'vite-plugin-favicons-inject';

/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'vite';
import autoprefixer from 'autoprefixer';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        eslint(),
        vitePluginFaviconsInject('src/img/dice/5.jpg'),
    ],
    css: {
        postcss: {
            plugins: [
                autoprefixer(),
            ],
        },
    },
});
