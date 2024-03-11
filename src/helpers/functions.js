 
  const  parseError = async ( errStrOrJson ) => {
    if (typeof errStrOrJson === 'object' && errStrOrJson !== null) {
      const firstKey = Object.keys(errStrOrJson)[0];
      return errStrOrJson[firstKey][0];
    } else {
      return errStrOrJson;
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
  
  export default {
    parseError,
    getErrorFields
  };