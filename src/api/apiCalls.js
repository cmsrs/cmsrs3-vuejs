import axios from "axios";

export const login = (creds) => {
    return axios.post("/api/login", creds);
};

/*
export const signUp = (body) => {
    return axios.post("/api/1.0/users", body);
};
*/