function loadConfig() {
    var constant = {};

    var domain = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
    constant.remoteUrl = domain + '/fina-app/';
    constant.remoteRestUrl = constant.remoteUrl + 'rest/first/v1/';
    constant.remoteRestUrlV2 = constant.remoteUrl + 'rest/first/v2/';

    return constant;
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}