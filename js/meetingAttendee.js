/*
    post https://wx.hongyancloud.com/api/meeting/attendee

    pageNumber:1
    pageSize:20
    hyid:190418000003

{
    "code": 200,
    "data": {
    "totalRow": 3,
        "pageNumber": 1,
        "firstPage": true,
        "lastPage": true,
        "totalPage": 1,
        "pageSize": 20,
        "list": [
        {
            "hzzt": "未查看",
            "signin": "",
            "ygbm": "11753",
            "ygmc": "柴真颖"
        },
        {
            "hzzt": "未回执",
            "signin": "",
            "ygbm": "01945",
            "ygmc": "毛袁晨"
        },
        {
            "hzzt": "未回执",
            "signin": "",
            "ygbm": "10889",
            "ygmc": "郑毅"
        }
    ]
},
    "message": "成功"
}
*/
var paramsObj=getRequestParams();
var hyid = paramsObj.hyid || '';
var ygbm = paramsObj.ygbm || "";
var dd_chatid = paramsObj.dd_chatid || '';
var layer;
var openChat = function (chatid) {
    chatid = chatid=='' ? dd_chatid : chatid;
    if (!chatid) {
        var shade = layer.load(3,{shade:[0.12,'#191f25']});
        $.ajax({
            type: 'post',
            url: 'https://wx.hongyancloud.com/api/meeting/chat',
            data: {
                appKey: 'ding7mtvnn9qm85dbwfm',
                hyid: hyid,
                ygbm: ygbm
            },
            success: function (res) {
                layer.close(shade);
                if(res.code == 200) {
                    dd_chatid = res.data.chatid;
                    openChat(dd_chatid);
                } else {
                    layer.alert(res.message, {icon: 2, btnAlign: 'c', closeBtn: 0});
                }
            },
            error: function (request, error) {
                layer.close(shade);
                layer.alert(error, {icon: 2, btnAlign: 'c', closeBtn: 0});
            }
        })
    } else {
        dd.ready(function () {
            dd.biz.chat.toConversation({
                corpId: _config.corpId,
                chatId: chatid,//会话Id
                onSuccess : function() {},
                onFail : function() {}
            })
        })
    }
}
$(function () {
    layui.use(['flow','layer'], function(){
        // var $ = layui.jquery; //不用额外加载jQuery，flow模块本身是有依赖jQuery的，直接用即可。
        layer = layui.layer;
        var flow = layui.flow;
        flow.load({
            elem: '#attendeeLists',
            done: function (page, next) { //到达临界点（默认滚动触发），触发下一页
                var lis = [];
                //以jQuery的Ajax请求为例，请求下一页数据（注意：page是从2开始返回）
                $.ajax({
                    type: "post",
                    url: "https://wx.hongyancloud.com/api/meeting/attendee",
                    data: {
                        pageNumber: page,
                        pageSize: 20,
                        hyid: hyid
                    },
                    success: function (res) {
                        layui.each(res.data.list, function (i, o) {
                            var fontCss = '';
                            if (o.state == '0') {
                                fontCss = 'gray';
                            } else if (o.state == '2') {
                                fontCss = 'dd_blue';
                            } else if (o.state == '3') {
                                fontCss = 'dd_red';
                            }
                            var str = "<li>\n" +
                                "            <div class=\"clearfix\">\n" +
                                "                <a class=\"fl\" href=\"javascript:void(0)\">"+o.ygmc+"<small class=\"gray\" style=\"margin: 0px 5px\">"+o.signin+"</small></a>" +
                                "                <em class=\"fr " + fontCss +  "\">"+o.hzzt+"</em>\n" +
                                "            </div>\n" +
                                "        </li>";
                            lis.push(str);
                        });
                        next(lis.join(''), page < res.data.totalPage);
                    }
                })
            }
        });
    });
});