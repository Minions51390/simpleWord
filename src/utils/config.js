// prod  http://81.70.229.127
const STATICURL = {
    dev: 'http://0.0.0.0:8080',
    prod: 'http://47.107.238.126',
    // prod: 'http://www.qingcheng-eng.com'
    // prod: 'http://81.70.229.127'
}

let baseUrl = '';
if (process.env.NODE_ENV === 'development') {
    baseUrl = STATICURL.dev;
}
else {
    baseUrl = STATICURL.prod;
}

export default baseUrl;