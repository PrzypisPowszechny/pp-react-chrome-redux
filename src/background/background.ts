// NOTE: This page is also used for hot reloading in webpack-chrome-extension-reloader
// (so it must be present at least in development)
import {storeSync} from './store/store';

console.log('Background script!');

storeSync.init();
