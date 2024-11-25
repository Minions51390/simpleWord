/*
 * @Author: yangqi06 yangqi06@kuaishou.com
 * @Date: 2023-10-22 13:20:53
 * @LastEditors: yangqi06 yangqi06@kuaishou.com
 * @LastEditTime: 2024-05-25 15:29:13
 * @FilePath: /simpleWord/src/utils/api.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
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