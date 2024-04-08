import { createApp } from 'vue';
import App from './App.vue';
//import router from "./router/router";
import router from    "./router/index.js";
import store from "./state/store";


createApp(App)
    .use(router)
    .use(store)
    .mount('#app');
