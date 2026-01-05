import { svelte } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import path from 'path';
import Icons from 'unplugin-icons/vite';
import type { UserConfig } from 'vite';

const resolve:UserConfig['resolve'] = {
  alias: {
    '@': path.resolve(__dirname, 'src'),
    '$': path.resolve(__dirname, 'resources'),
  },
};

const assetsInclude: UserConfig['assetsInclude'] = [
  '**/*.html',
];

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    resolve,
    assetsInclude,
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    resolve,
    assetsInclude,
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
    assetsInclude,
  }
});
