import 'webextension-polyfill';
import { exampleThemeStorage } from '@extension/storage';
import './alarm';
import './context-menus';
exampleThemeStorage.get().then(theme => {
  console.log('theme', theme);
});

// console.log('background loaded');
// console.log("Edit 'chrome-extension/src/background/index.ts' and save to reload.");

