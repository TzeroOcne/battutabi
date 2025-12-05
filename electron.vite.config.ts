import { svelte } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import path from 'path';
import Icons from 'unplugin-icons/vite';
import type { UserConfig } from 'vite';

const resolve:UserConfig['resolve'] = {
  alias: {
    '@': path.resolve(__dirname, 'src'),
  },
};

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    resolve,
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    resolve,
  },
  renderer: {
    plugins: [
      tailwindcss(),
      svelte(),
      Icons({
        compiler: 'svelte',
      }),
    ],
    resolve,
  }
});
