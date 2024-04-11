//import './assets/styles.scss'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
//import { i18n } from './locales'

import router from './router/index.js'
const app = createApp(App)

app.use(i18n)
app.use(createPinia())
app.use(router)

app.mount('#app')

//console.log('jestemmmmmmmmmmmmmmmmmmmmmmmmmm')


/*
import { createApp } from 'vue';
import App from './App.vue';
//import router from "./router/router";
import router from    "./router/index.js";
import store from "./state/store";


createApp(App)
    .use(router)
    .use(store)
    .mount('#app');
*/
