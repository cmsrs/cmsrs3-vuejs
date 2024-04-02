 
  const  parseError = async ( errStrOrJson ) => {
    if (typeof errStrOrJson === 'object' && errStrOrJson !== null) {
      //const firstKey = Object.keys(errStrOrJson)[0];
      //return errStrOrJson[firstKey][0];
      return errStrOrJson;
    } else {
      return  { 'err' : [errStrOrJson] };
    }
  };

  const getErrorFields = async ( errStrOrJson ) => {
    let result = [];

    if (typeof errStrOrJson === 'object' && errStrOrJson !== null) {
      const errKeys = Object.keys(errStrOrJson);

      for (const key of  errKeys) {
        const keyWithoutLanguage = key.split('.')[0];
        if (!result.includes(keyWithoutLanguage)) {
          result.push(keyWithoutLanguage);
        }
      }      
    }

    return result;
  };

  const createEmptyObj = ( langs ) => {
    const emptyObj = {};
    langs.forEach(lang => {
      emptyObj[lang] = '';
    });
    return emptyObj;
  };

  //this function is not use in code
  const isNotEmptyObj = ( obj, keys ) => {
    if( Object.keys(obj).length === 0 ){
      return false;
    }

    let isNotEmpty = true;
    for(let key of keys ){
      if( !obj[key] ){
        isNotEmpty = false;
        break;
      }
    }
    return isNotEmpty;
  };

  const retrieveParamsFromStorage = (storage) => {
    const storedStateConfig = storage.getItem("config"); //when we refresh /pages the config not disappear
    let configLangs = [];
    let configDefaultLang = '';
    let pageTypes = [];

    if(storedStateConfig){
      configLangs = storedStateConfig.langs;
      configDefaultLang = storedStateConfig.defaultLang;
      pageTypes = storedStateConfig.page_types;
    }

    const storedState = storage.getItem("auth");
    let token = '';
    if(storedState){
      token = storedState.token;
    }

    return { configLangs, configDefaultLang, pageTypes, token };
  };

  const retrieveParamsFromUrl = (url, param) => {
    const objUrl = new URL(url);
    const params = new URLSearchParams(objUrl.search);
    const page = params.get(param);    
    return page;
  };
  
  export default {
    createEmptyObj,
    parseError,
    getErrorFields,
    retrieveParamsFromStorage,
    retrieveParamsFromUrl,
    isNotEmptyObj
  };