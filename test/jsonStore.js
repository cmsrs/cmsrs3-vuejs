const getJsonStore = () => {
    return {
      auth: {
        token:  "abcde12345",
      },
      //this data came from api/config and save to local storage
      config: {
        page_types: ['cms', 'gallery', 'main_page'],
        langs: ['en'],
        default_lang: 'en',
        cache_enable: 1
      }
    };
};
    
export default {
    getJsonStore
};