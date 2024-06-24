const testJsonStore ={
  auth: {
    token:  "abcde12345",
  },
  //this data came from api/config and save to local storage
  config: {
    page_types: ['cms', 'gallery', 'main_page'],
    langs: ['en'],
    default_lang: 'en',
    cache_enable: 1,
    is_cache_enable: 0,
    is_shop: 1
  }
};

const getJsonStore = () => {
    return testJsonStore;
};

const getTestToken = () => {
  return testJsonStore.auth.token;
};


export default {
    getJsonStore,
    getTestToken    
};