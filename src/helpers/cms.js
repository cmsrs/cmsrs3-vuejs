const getNotRelatedPages = (pages) => {
  let out = [];
  for (let page of pages) {
    if (!page.menu_id && "inner" !== page.type) {
      out.push(page);
    }
  }
  return out;
};

const getInnerPages = (pages) => {
  let out = [];
  for (let page of pages) {
    if ("inner" === page.type) {
      out.push(page);
    }
  }
  return out;
};
const getPagesBelongsToMenus = (pages) => {
  let out = [];
  for (let page of pages) {
    if (page.menu_id && !page.page_id) {
      if ("undefined" === typeof out[page.menu_id]) {
        out[page.menu_id] = [];
      }
      out[page.menu_id].push(page);
    }
  }
  return out;
};
const getPagesBelongsToPages = (pages) => {
  let out = [];
  for (let page of pages) {
    if (page.page_id) {
      if ("undefined" === typeof out[page.page_id]) {
        out[page.page_id] = [];
      }
      out[page.page_id].push(page);
    }
  }
  return out;
};

const getInfoMsgPrefixByLang = (langs, currentLang) => {
  let infoMsgPrefix = "";
  if (langs.length > 1) {
    infoMsgPrefix = " for lang = " + currentLang;
  }
  return infoMsgPrefix;
};

/**
 * todo move this function to functions
 * only root pages without children (copy from react)
 * get root pages belongs to given menu, and get pages without children
 */
const getRootPages = (menuId, currentPageIdValue, allPagesValue) => {
  if (!menuId) {
    return [];
  }
  menuId = parseInt(menuId);
  const pageId = currentPageIdValue ? parseInt(currentPageIdValue) : false;

  let parentIds = []; //get children
  for (let p of allPagesValue) {
    if (p.menu_id === menuId && p.page_id) {
      parentIds.push(p.page_id);
    }
  }

  let pages = [];

  //only one level of depth
  if (parentIds.includes(pageId)) {
    return pages;
  }

  for (let p of allPagesValue) {
    //edit
    if (p.menu_id === menuId && !p.page_id && pageId && p.id !== pageId) {
      pages.push(p);
    }
    //new
    if (p.menu_id === menuId && !p.page_id && !pageId) {
      pages.push(p);
    }
  }

  return pages;
};

export default {
  getNotRelatedPages,
  getInnerPages,
  getPagesBelongsToMenus,
  getPagesBelongsToPages,
  getInfoMsgPrefixByLang,
  getRootPages,
};
