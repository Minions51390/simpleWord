export function getQueryString(name) {
    var reg = new RegExp("[?&]" + name + "=([^&#]*)", "i");
    var res = window.location.href.match(reg);
 
    if( res && res.length>1 ){
        return decodeURIComponent(res[1]);
    }
    return '';
}

