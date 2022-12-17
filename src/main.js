import { createApp } from 'vue';
import App from './App.vue';
import router from "./routes/router";
import store from "./state/store";


createApp(App)
    .use(router)
    .use(store)
    .mount('#app');