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
