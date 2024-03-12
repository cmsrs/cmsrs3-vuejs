const ttt =  ( key ) => {

    const d = {
        success_page_add: 'Page has been added',
        success_page_edit: 'Page has been changed'
    }
        
    return d[key] ? d[key] : key;

};
  
export default {
    ttt
};