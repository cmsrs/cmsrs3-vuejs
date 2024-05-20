import axios from "axios";

export const login = (creds) => {
  return axios.post("/api/login", creds);
};

export const config = (token) => {
  return axios.get("/api/config?token=" + token);
};

export const logout = (token) => {
  return axios.get("/api/logout?token=" + token);
};

export const postPage = (post, token) => {
  const ret = axios.post("/api/pages?token=" + token, post);
  return ret;
};

export const putPage = (post, id, token) => {
  return axios.put("/api/pages/" + id + "?token=" + token, post);
};

export const getPages = (token) => {
  return axios.get("/api/pages?token=" + token);
};

//it use in products, where type = 'shop'
export const getPagesByType = (type, token) => {
  return axios.get("/api/pages/type/"+type+"?token=" + token);
};

//when click edit  page we get new data
export const getPage = (id, token) => {
  return axios.get("/api/pages/" + id + "?token=" + token);
};

export const postMenu = (post, token) => {
  return axios.post("/api/menus?token=" + token, post);
};

export const putMenu = (post, token) => {
  const id = post["id"];
  return axios.put("/api/menus/" + id + "?token=" + token, post);
};

export const getMenus = (token) => {
  return axios.get("/api/menus?token=" + token);
};

export const deleteMenu = (id, token) => {
  return axios.delete("/api/menus/" + id + "?token=" + token);
};

export const setMenuPosition = (direction, id, token) => {
  return axios.get(
    "/api/menus/position/" + direction + "/" + id + "?token=" + token,
  );
};

export const setPagePosition = (direction, id, token) => {
  return axios.get(
    "/api/pages/position/" + direction + "/" + id + "?token=" + token,
  );
};

export const deletePage = (id, token) => {
  return axios.delete("/api/pages/" + id + "?token=" + token);
};

export const uploadImage = (post, type, id, token) => {
  return axios.post("/api/image/" + type + "/" + id + "?token=" + token, post);
};

export const getImages = (type, id, token) => {
  return axios.get("/api/images/" + type + "/" + id + "?token=" + token);
};

//we can also delete many images, see API docs
export const deleteImage = (id, token) => {
  return axios.delete("/api/images/" + id + "?token=" + token);
};

export const setImagePosition = (direction, id, token) => {
  return axios.get(
    "/api/images/position/" + direction + "/" + id + "?token=" + token,
  );
};

export const getClients = (column, direction, token, page, search) => {
  let strSearch = "";
  if (search) {
    strSearch = "&search=" + search;
  }

  const pageNumber = page ? page : "1";
  const url =
    "/api/clients/" +
    column +
    "/" +
    direction +
    "?token=" +
    token +
    "&page=" +
    pageNumber +
    strSearch;

  return axios.get(url);
};

export const getProducts = (lang, column, direction, token, page, search) => {
  let strSearch = "";
  if (search) {
    strSearch = "&search=" + search;
  }

  const pageNumber = page ? page : "1";
  // /api/products/pagination/en/product_name/desc
  const url =
    "/api/products/pagination/" +
    lang +
    "/" +    
    column +
    "/" +
    direction +
    "?token=" +
    token +
    "&page=" +
    pageNumber +
    strSearch;

  return axios.get(url);
};

export const deleteProduct = (id, token) => {
  return axios.delete("/api/products/" + id + "?token=" + token);
};

export const deleteClient = (id, token) => {
  return axios.delete("/api/clients/" + id + "?token=" + token);
};

export const getClient = (id, token) => {
  return axios.get("/api/clients/" + id + "?token=" + token);
};

export const postClient = (post, token) => {
  return axios.post("/api/clients?token=" + token, post);
};

export const putClient = (post, token) => {
  const id = post["id"];
  return axios.put("/api/clients/" + id + "?token=" + token, post);
};

export const getProduct = (id, token) => {
  return axios.get("/api/products/" + id + "?token=" + token);
};

export const postProduct = (post, token) => {
  return axios.post("/api/products?token=" + token, post);
};

export const putProduct = (post, token) => {
  const id = post["id"];
  return axios.put("/api/products/" + id + "?token=" + token, post);
};
