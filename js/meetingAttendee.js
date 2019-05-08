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
$(function () {
    var paramsObj = getRequestParams();
    var hyid = paramsObj.hyid;
    layui.use('flow', function(){
        // var $ = layui.jquery; //不用额外加载jQuery，flow模块本身是有依赖jQuery的，直接用即可。
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
                        pageSize: 6,
                        hyid: hyid
                    },
                    success: function (res) {
                        layui.each(res.data.list, function (i, o) {
                            var str = "<li>\n" +
                                "            <div class=\"clearfix\">\n" +
                                "                <a class=\"fl\" href=\"javascript:void(0)\">"+o.ygmc+"</a>\n" +
                                "                <span class=\"fr\">"+o.signin+"</span>\n" +
                                "            </div>\n" +
                                "        </li>";
                            lis.push(str);
                        });
                        next(lis.join(''), page < res.data.totalPage);

                        $(document).on("touchend","#messLists li",function () {
                            var hyid = $(this).attr("hyid");
                            document.location.href = "meetingDetail"+(dd?"_dd":"")+".html?hyid="+hyid+"&ygbm="+ygbm
                        })
                    }
                })
            }
        });
    });
});