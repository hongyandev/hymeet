var paramsObj = getRequestParams();
var ygbm = paramsObj.ygbm || "";
var loadFlow = function (ygbm) {
    layui.use('flow', function(){
        // var $ = layui.jquery; //不用额外加载jQuery，flow模块本身是有依赖jQuery的，直接用即可。
        var flow = layui.flow;
        flow.load({
            elem: '#messLists',
            done: function (page, next) { //到达临界点（默认滚动触发），触发下一页
                var lis = [];
                //以jQuery的Ajax请求为例，请求下一页数据（注意：page是从2开始返回）
                $.ajax({
                    type: "post",
                    url: "https://wx.hongyancloud.com/api/meeting/list",
                    data: {
                        pageNumber: page,
                        pageSize: 20,
                        ygbm: ygbm
                    },
                    success: function (res) {
                        layui.each(res.data.list, function (i, o) {
                            var str = " <li hyid='"+o.hyid+"'>\n" +
                                "      <div class=\"messInfo\">\n" +
                                "      <p>" + o.hytitle + "</p>\n" ;
                            if(o.state=="1"){ // 未回执
                                str+="       <span class=\"messReply\">"+o.hzzt+"</span>\n";
                            }else if(o.state=="0"){ // 未查看
                                str+="       <span class=\"messReply redCircle\"></span>\n";
                            }else if(o.state=="2"){ // 参加
                                str+="       <span class=\"messReply yue\">"+o.hzzt+"</span>\n";
                            }else if(o.state=="3"){ // 不参加
                                str+="       <span class=\"messReply dd_red\">"+o.hzzt+"</span>\n";
                            };
                            str+=" <time>" + o.kssj + "</time>" +
                                "       </div>\n" +
                                "      </li>"
                            lis.push(str);
                        });
                        next(lis.join(''), page < res.data.totalPage);

                        $(document).on("click touchstart","#messLists li",function () {
                            var hyid = $(this).attr("hyid");
                            if (dd){
                                document.location.href = "meetingDetail_dd.html?hyid="+hyid+"&ygbm="+ygbm
                            } else {
                                document.location.href = "meetingDetail.html?hyid="+hyid+"&ygbm="+ygbm
                            }
                        })
                    }
                })
            }
        });
    });
}
$(function () {
    if(ygbm){
        loadFlow(ygbm);
    }
});
