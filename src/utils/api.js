import axios from 'axios';

const url = {
    dev: 'http://0.0.0.0:8080/api/v1',
    devV2: 'http://0.0.0.0:8080/api/v2',
    // dev: 'http://47.107.238.126',
    // prod: 'http://81.70.229.127'
    // prod: 'http://www.qingchengeng.com'
    // prod: 'http://www.qingcheng-eng.com'
    prod: '/api/v1', //二期错词结课测试环境
    prodV2: '/api/v2'
    
    // prod: 'http://47.107.238.126'
}

let baseURL = '';
let baseURLV2 = '';

if (process.env.NODE_ENV === 'development') {
    baseURL = url.dev;
    baseURLV2 = url.devV2;
}
else {
    baseURL = url.prod;
    baseURLV2 = url.prodV2;
}

const http = axios.create({
    baseURL: baseURL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const HTTPV2 = axios.create({
    baseURL: baseURLV2,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default http;