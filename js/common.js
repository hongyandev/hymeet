var _config;
var _userinfo = {};
var getRequestParams = function () {
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if(url.indexOf("?") != -1) {
        var str = url.substr(1);
        var strs = str.split("&");
        for(var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}

var converUserLink = function (uid, username) {
    if (dd) {
        return "<a class='dd_blue' href='javascript:openUserinfo(\""+uid+"\")'>"+username+"</a>"
    } else {
        return username;
    }
}

var openUserinfo = function (uid) {
    if (dd) {
        dd.biz.util.open({
            name: 'profile',
            params: {
                id: uid,
                corpId: _config.corpId
            },
            onSuccess : function() {},
            onFail : function(err) {}
        });
    }
}