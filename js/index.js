var paramsObj = getRequestParams();
var ygbm = paramsObj.ygbm || "";
var page = 0;
var pageSize = 10;
var doAjax = function (downOrUp) {
    if(!ygbm){
        return;
    }
    if (downOrUp == 'down') {
        page = 1;// 下拉刷新页码设置
        pageSize = 10;
    } else {
        page++;// 上拉加载递增页码
        pageSize = 10;//
    }
    $.ajax({
        url: 'https://wx.hongyancloud.com/api/meeting/list',// 请求网址
        type: 'post',
        data: {// 请求参数，一般会带上页码
            pageNumber: page,
            pageSize: pageSize,
            ygbm: ygbm
            /* 't': new Date().getTime()// 防止GET请求缓存 */
        },
        success: function (res) {
            // 下面这段请根据自己的数据结构来处理
            var arrLen = res.data.list.length;
            if (arrLen > 0) {
                var str = '';
                $.each(res.data.list, function (i, o) {
                    str += " <li hyid='" + o.hyid + "'>\n" +
                        "      <div class=\"messInfo\">\n" +
                        "      <p>" + o.hytitle + "</p>\n";
                    if (o.state == "1") { // 未回执
                        str += "       <span class=\"messReply\">" + o.hzzt + "</span>\n";
                    } else if (o.state == "0") { // 未查看
                        str += "       <span class=\"messReply redCircle\"></span>\n";
                    } else if (o.state == "2") { // 参加
                        str += "       <span class=\"messReply yue\">" + o.hzzt + "</span>\n";
                    } else if (o.state == "3") { // 不参加
                        str += "       <span class=\"messReply dd_red\">" + o.hzzt + "</span>\n";
                    };
                    str += " <time>" + o.kssj + "</time>" +
                        "       </div>\n" +
                        "      </li>";
                });
                setTimeout(function () { // 使用 setTimeout 函数是方便演示的，你可以不用 setTimeout 函数
                    if (downOrUp == 'down') {
                        $('#messLists').html('');
                        $('#messLists').html(str);// DOM 插入数据
                        $("#messLists li").on("click",function () {
                            var hyid = $(this).attr("hyid");
                            if (dd){
                                document.location.href = "meetingDetail_dd.html?hyid="+hyid+"&ygbm="+ygbm
                            } else {
                                document.location.href = "meetingDetail.html?hyid="+hyid+"&ygbm="+ygbm
                            }
                        })
                        miniRefresh.endDownLoading(true);// 结束下拉刷新
                    } else {
                        $('#messLists').append(str);
                        $("#messLists li").on("click",function () {
                            var hyid = $(this).attr("hyid");
                            if (dd){
                                document.location.href = "meetingDetail_dd.html?hyid="+hyid+"&ygbm="+ygbm
                            } else {
                                document.location.href = "meetingDetail.html?hyid="+hyid+"&ygbm="+ygbm
                            }
                        })
                        if (res.data.totalpage == page) {// 是否已取完数据页
                            miniRefresh.endUpLoading(true);// 结束上拉加载
                        } else {
                            miniRefresh.endUpLoading(false);
                        }
                    }
                }, 600);

            } else {
                if (downOrUp == 'down') {
                    $('#messLists').html('');
                    miniRefresh.endDownLoading(true);
                } else {
                    miniRefresh.endUpLoading(true);
                }
            }
        },
        error: function () {
            if (downOrUp == 'down') {
                $('#listdata').html('');
                miniRefresh.endDownLoading(true);
            } else {
                miniRefresh.endUpLoading(true);
            }
        }
    });
};
var miniRefresh = new MiniRefresh({
    container: '#minirefresh',
    down: {
        callback: function () {
            doAjax('down');
        }
    },
    up: {
        isAuto: true,
        callback: function () {
            doAjax('up');
        }
    }
});
