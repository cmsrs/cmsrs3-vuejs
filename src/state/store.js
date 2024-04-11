import { defineStore } from 'pinia'
import { reactive, watch } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  let initialState = {
    token: 0
  }

  let initialConfig = {
    page_types: [],
    langs: [],
    cache_enable: 0
  }

  const storedState = localStorage.getItem('auth')
  if (storedState !== null) {
    try {
      initialState = JSON.parse(storedState)
    } catch {}
  }

  const storedConfig = localStorage.getItem('config')
  if (storedConfig !== null) {
    try {
      initialConfig = JSON.parse(storedConfig)
    } catch {}
  }


  const auth = reactive(initialState)
  const config = reactive(initialConfig)

  //function setLoggedIn(data) {
  function setAuth(data) {    
    auth.token = data.token
    //auth.id = data.id
    //auth.username = data.username
    //auth.email = data.email
  }

  function setConfig(data) {
    config.page_types = data.page_types
    config.langs = data.langs
    config.cache_enable = data.cache_enable
  }

  function logout() {
    auth.token = 0
    config.page_types = []
    config.langs = []
    config.cache_enable = 0

    //auth.id = 0
    //delete auth.username
    //delete auth.email
  }

  watch(auth, () => {
    localStorage.setItem('auth', JSON.stringify(auth))
  })

  watch(config, () => {
    localStorage.setItem('config', JSON.stringify(config))
  })


  return { auth, setAuth, setConfig, logout }
})



/*
import { createStore } from "vuex";
import storage from "./storage";

const store = createStore({
  state() {
    const auth = storage.getItem("auth") || false;
    const config = storage.getItem("config") || false;
    return {   
      'auth' : auth,
      'config' : config
    };
  },
  mutations: {
    loginSuccess(state, data) {
      state.auth = {};
      state.auth.isLoggedIn = true;
      for (let key in data) {
        state.auth[key] = data[key];
      }
    },
    reset(state, initialState) {
      state.auth.isLoggedIn = false;
      delete state.auth.id;
      for (let key in initialState) {
        state.auth[key] = initialState[key];
      }
      state.config = false;
    },
    setConfig(state, config) {
      state.config = {};
      state.config.cache_enable = config.cache_enable;
      state.config.langs = [];
      for (let key in config.langs) {
        state.config.langs[key] = config.langs[key];
      }
      state.config.defaultLang = config.langs ? config.langs[0] : '';

      state.config.page_types = [];
      for (let key in config.page_types) {
        state.config.page_types[key] = config.page_types[key];
      }
    }
  }
});

store.subscribe((mutation, state) => {
  storage.setItem("auth", state.auth);
  storage.setItem("config", state.config);
});

export const resetAuthState = () => {
  store.commit("reset", storage.getItem("auth"));
};

export default store;
*/