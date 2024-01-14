import axios from "axios";

export const login = (creds) => {
    return axios.post("/api/login", creds);
};

export const config = (token) => {
    return axios.get("/api/config?token="+token);
};


export const postPage = (post, token) => {
    return axios.post("/api/pages?token="+token, post);
};

export const getPages = (token) => {
    return axios.get("/api/pages?token="+token);
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
