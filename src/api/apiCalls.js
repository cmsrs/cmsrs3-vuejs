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

/*
export const signUp = (body) => {
    return axios.post("/api/1.0/users", body);
};
*/