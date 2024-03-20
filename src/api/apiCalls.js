import axios from "axios";

export const login = (creds) => {
    return axios.post("/api/login", creds);
};

export const config = (token) => {
    return axios.get("/api/config?token="+token);
};

export const postPage = (post, token) => {
    //console.log('____________________postPage___________');
    const ret = axios.post("/api/pages?token="+token, post);
    //console.log( ret );
    return ret;
};

export const putPage = (post, id, token) => {
    return axios.put("/api/pages/"+id+"?token="+token, post);
};

export const getPages = (token) => {
    return axios.get("/api/pages?token="+token);
};

//not use
export const getPage = (id, token) => {
    return axios.get("/api/pages/"+id+"?token="+token);
};

export const postMenu = (post, token) => {
    return axios.post("/api/menus?token="+token, post);
};

export const putMenu = (post, token) => {
    const id = post['id'];
    return axios.put("/api/menus/"+id+"?token="+token, post);
};

export const getMenus = (token) => {
    return axios.get("/api/menus?token="+token);
};

export const deleteMenu = (id, token) => {
    return axios.delete("/api/menus/"+id+"?token="+token);
};

export const setMenuPosition = (direction, id, token) => {
    return axios.get("/api/menus/position/"+direction+"/"+id+"?token="+token);
};

export const setPagePosition = (direction, id, token) => {
    return axios.get("/api/pages/position/"+direction+"/"+id+"?token="+token);
};

export const deletePage = (id, token) => {
    return axios.delete("/api/pages/"+id+"?token="+token);
};


export const uploadImage = (post, type, id, token) => {
    return axios.post("/api/image/"+type+"/"+id+"?token="+token, post) ;
};

export const getImages = (type, id, token) => {
    return axios.get("/api/images/"+type+"/"+id+"?token="+token) ;
};

export const deleteImage = (id, token) => {
    return axios.delete("/api/images/"+id+"?token="+token);
};

export const setImagePosition = (direction, id, token)  => {
    return axios.get("/api/images/position/"+direction+"/"+id+"?token="+token);
};
