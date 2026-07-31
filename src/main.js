import App from './app/App.svelte';

document.body.addEventListener('touchstart', function () {}, false);
const app = new App({ target: document.body });

export default app;
