/*
 * @Author: yangqi06 yangqi06@kuaishou.com
 * @Date: 2023-10-22 13:20:53
 * @LastEditors: yangqi06 yangqi06@kuaishou.com
 * @LastEditTime: 2024-03-10 17:25:18
 * @FilePath: /simpleWord/src/utils/api.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import axios from 'axios';

const url = {
    dev: 'http://localhost:8080/api/v1',
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