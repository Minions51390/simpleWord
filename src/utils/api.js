import axios from 'axios';

const url = {
    dev: 'http://0.0.0.0:8080/api',
    prod: 'http://47.107.238.126'
}

let baseURL = '';

if (process.env.NODE_ENV === 'development') {
    baseURL = url.dev;
}
else {
    baseURL = url.prod;
}

const http = axios.create({
    baseURL: baseURL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    },
});

export default http;