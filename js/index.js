$(function () {
    var paramsObj=GetRequest();
    var ygbm = paramsObj.ygbm;
    layui.use('flow', function(){
        var $ = layui.jquery; //不用额外加载jQuery，flow模块本身是有依赖jQuery的，直接用即可。
        var flow = layui.flow;
        flow.load({
            elem: '#messLists' //指定列表容器
            , done: function (page, next) { //到达临界点（默认滚动触发），触发下一页
                var lis = [];
                //以jQuery的Ajax请求为例，请求下一页数据（注意：page是从2开始返回）
                $.ajax({
                    type: "post",
                    url: "http://sge.cn:9106/api/meeting/list",
                    data: {
                        pageNumber: page,
                        pageSize: 6,
                        ygbm: ygbm
                    },
                    success: function (res) {
                        layui.each(res.data.list, function (i, o) {
                            var str = " <li hyid='"+o.hyid+"'>\n" +
                                "      <div class=\"messInfo\">\n" +
                                "      <p>" + o.hytitle + "</p>\n" ;
                            if(o.state=="1"){ // 未回执
                                str+="       <span class=\"messReply yue\">"+o.hzzt+"</span>\n";
                            }else if(o.state=="0"){ // 未查看
                                str+="       <span class=\"messReply redCircle\"></span>\n";
                            }else if(o.state=="2"){ // 参加
                                str+="       <span class=\"messReply yue\">"+o.hzzt+"</span>\n";
                            }else if(o.state=="3"){ // 不参加
                                str+="       <span class=\"messReply yue\">"+o.hzzt+"</span>\n";
                            };
                            str+=" <time>" + o.kssj + "</time>" +
                                "       </div>\n" +
                                "      </li>"
                            lis.push(str);
                        });
                        next(lis.join(''), page < res.data.totalPage);

                        $(document).on("click","#messLists li",function () {
                            var hyid = $(this).attr("hyid");
                            document.location.href = "meetingDetail.html?hyid="+hyid+"&ygbm="+ygbm
                        })

                    }
                })
            }
        });
    })

});
function GetRequest() {
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if(url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for(var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}