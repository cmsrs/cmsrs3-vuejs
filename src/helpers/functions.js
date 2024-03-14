 
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

  
  export default {
    createEmptyObj,
    parseError,
    getErrorFields,
    isNotEmptyObj
  };