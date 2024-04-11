const getJsonStore = () => {
    return {
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
};
    
export default {
    getJsonStore
};