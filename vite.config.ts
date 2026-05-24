import { defineConfig } from 'vite';
import monkey from 'vite-plugin-monkey';

// === Configuration ===
const SCRIPT_NAME = 'Better Rezka';
const NAMESPACE = 'https://github.com/ilyachch';
const MATCH_URLS = ['*://*/*'];
const ICON_URL = 'https://www.google.com/s2/favicons?sz=64&domain=github.com';
// =====================

export default defineConfig({
  plugins: [
    monkey({
      entry: 'src/main.ts',
      userscript: {
        name: SCRIPT_NAME,
        namespace: NAMESPACE,
        match: MATCH_URLS,
        icon: ICON_URL,
        description: 'Tampermonkey app',
        author: 'ilyachch',
        grant: ['GM_addStyle'],
        homepageURL: 'https://github.com/ilyachch-userscripts/better-rezka',
        supportURL: 'https://github.com/ilyachch-userscripts/better-rezka/issues',
        updateURL: 'https://github.com/ilyachch-userscripts/better-rezka/releases/latest/download/better-rezka.user.js',
        downloadURL: 'https://github.com/ilyachch-userscripts/better-rezka/releases/latest/download/better-rezka.user.js',
        fileName: 'better-rezka.user.js',
        'run-at': 'document-end',
      },
    }),
  ],
});
