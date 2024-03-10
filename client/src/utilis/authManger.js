import axios from "axios";
// https://igbo-site.vercel.app
const API_BASE_URL = 'https://igbo-site.vercel.app/api'; // Replace this with your API base URL

const api = axios.create({
    baseURL: API_BASE_URL,
});

function headers(token) {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Origin': window.location.origin
    };
}

export function userSigned() {
    const userStat = localStorage.getItem('user');
    return userStat ? JSON.parse(userStat) : false;
}

export function userLogOut(callback) {
    if (userSigned()) {
        localStorage.removeItem('user');
        callback();
    } else {
        return null;
    }
}

export const authUser = async (endpoint, payload) => {
    return await api.post(endpoint, payload);
};

export const createUser = async (endpoint, data) => {
    return await api.post(endpoint, data);
};

export const getUser = async (endpoint, token) => {
    return await api.get(endpoint, { headers: headers(token) });
};

export const getUserData = async (endpoint) => {
    return await api.get(endpoint);
};

export const postUserData = async (endpoint, data) => {
    return await api.post(endpoint, data);
};

export async function authAdmin(endpoint, payload) {
    return await api.post(endpoint, payload);
}

export function adminSigned() {
    const userStat = localStorage.getItem('admin');
    return userStat ? JSON.parse(userStat) : false;
}

export async function getAdmin(endpoint, token) {
    return await api.get(endpoint, { headers: headers(token) });
}

export async function adminGet(endpoint, token) {
    return await api.get(endpoint, { headers: headers(token) });
}

export async function adminPost(endpoint, payload, token) {
    return await api.post(endpoint, payload, { headers: headers(token) });
}
