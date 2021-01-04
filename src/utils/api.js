import axios from 'axios';

const url = {
    dev: 'http://0.0.0.0:8080/api',
    // dev: 'http://47.107.238.126',
    prod: 'http://81.70.229.127'
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