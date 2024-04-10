import storage from "../src/state/storage.js"

const jsonStore = {
    auth: {
      token:  "abcde12345",
    },
    config: {
      page_types: ['cms', 'gallery', 'main_page'],
      langs: ['en'], //!!
      defaultLang: 'en', //!!
      cache_enable: 1
    }
};
    
beforeEach(() => {
    storage.setItem('auth', jsonStore.auth )
    storage.setItem('config', jsonStore.config )
})
  