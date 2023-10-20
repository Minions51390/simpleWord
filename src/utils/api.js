import axios from 'axios';

const url = {
    dev: 'http://0.0.0.0:8080/api/v1',
    // dev: 'http://47.107.238.126',
    // prod: 'http://81.70.229.127'
    // prod: 'http://www.qingchengeng.com'
    // prod: 'http://www.qingcheng-eng.com'
    prod: '/api/v1' //二期错词结课测试环境
    
    // prod: 'http://47.107.238.126'
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
        'Content-Type': 'application/json',
    },
});

export default http;