import { defineConfig } from 'vite';
import monkey from 'vite-plugin-monkey';

// === Configuration ===
const SCRIPT_NAME = 'Better Rezka';
const NAMESPACE = 'https://github.com/ilyachch';
const ICON_URL = 'https://www.google.com/s2/favicons?sz=64&domain=github.com';
// =====================

export default defineConfig({
  plugins: [
    monkey({
      entry: 'src/main.ts',
      build: {
        fileName: 'better-rezka.user.js',
      },
      userscript: {
        name: SCRIPT_NAME,
        namespace: NAMESPACE,
        match: ['*://rezka.ag/*'],
        icon: ICON_URL,
        description: 'Better Rezka userscript',
        author: 'ilyachch',
        grant: ['GM_registerMenuCommand', 'GM_unregisterMenuCommand'],
        homepageURL: 'https://github.com/ilyachch-userscripts/better-rezka',
        supportURL: 'https://github.com/ilyachch-userscripts/better-rezka/issues',
        updateURL: 'https://github.com/ilyachch-userscripts/better-rezka/releases/latest/download/better-rezka.user.js',
        downloadURL: 'https://github.com/ilyachch-userscripts/better-rezka/releases/latest/download/better-rezka.user.js',
        'run-at': 'document-end',
      },
    }),
  ],
});
