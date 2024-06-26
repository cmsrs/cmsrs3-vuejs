import { defineStore } from "pinia";
import { reactive, watch } from "vue";

export const useAuthStore = defineStore("auth", () => {
  let initialState = {
    token: 0,
  };

  let initialConfig = {
    page_types: [],
    langs: [],
    cache_enable: 0,
    is_cache_enable: 0,
    default_lang: "",
    demo_status: 0,
    is_shop: 1,
  };

  let initialModal = {
    visible: false,
  };

  const storedState = localStorage.getItem("auth");
  if (storedState !== null) {
    try {
      initialState = JSON.parse(storedState);
    } catch {}
  }

  const storedConfig = localStorage.getItem("config");
  if (storedConfig !== null) {
    try {
      initialConfig = JSON.parse(storedConfig);
    } catch {}
  }

  const auth = reactive(initialState);
  const config = reactive(initialConfig);
  const modal = reactive(initialModal);

  //function setLoggedIn(data) {
  function setAuth(data) {
    auth.token = data.token;
    //auth.id = data.id
    //auth.username = data.username
    //auth.email = data.email
  }

  function setModal(visible) {
    modal.visible = visible;
  }

  function setIsCacheEnable(isCacheEnable) {
    config.is_cache_enable = isCacheEnable;
  }

  function setConfig(data) {
    config.page_types = data.page_types;
    config.langs = data.langs;
    config.default_lang = data.default_lang;
    config.cache_enable = data.cache_enable;
    config.is_cache_enable = data.is_cache_enable;
    config.demo_status = data.demo_status;
    config.is_shop = data.is_shop;
  }

  function setDefaultLang(lang) {
    config.default_lang = lang;
  }

  function logout() {
    auth.token = 0;
    config.page_types = [];
    config.langs = [];
    config.cache_enable = 0;
    config.is_cache_enable = 0;
    config.default_lang = "";
    config.demo_status = 0;
    config.is_shop = 1;

    //auth.id = 0
    //delete auth.username
    //delete auth.email
  }

  watch(auth, () => {
    localStorage.setItem("auth", JSON.stringify(auth));
  });

  watch(config, () => {
    localStorage.setItem("config", JSON.stringify(config));
  });

  return {
    auth,
    modal,
    config,
    setIsCacheEnable,
    setDefaultLang,
    setAuth,
    setConfig,
    setModal,
    logout,
  };
});
