$(function () {
    var paramsObj=GetRequest();
    var ygbm = paramsObj.ygbm;
    var hyid = paramsObj.hyid;
    layui.use('layer', function() {
        // var $ = layui.jquery;
        var layer = layui.layer;
        $.ajax({
            type: "post",
            url: "http://sge.cn:9106/api/meeting/info",
            data: {
                hyid: hyid,
                ygbm: ygbm
            },
            success: function (res) {
                if(res.code=='200'){
                    $(".mDetailTop h1").html(res.data.hytitle);
                    $(".mDetailTime").html(res.data.hydate);
                    $(".mZj .zjr").html(res.data.zjr);
                    $(".address").html(res.data.hyaddr);
                    var str='';
                    for(var i=0;i<res.data.attendee.length;i++){
                        if(res.data.attendee[i].hzzt=='0'||res.data.attendee[i].hzzt=='1'){
                            str += '<a href="javascript:void(0)">'+res.data.attendee[i].ygmc+'</a>'
                        }else{
                            str += '<a class="gray" href="javascript:void(0)">'+res.data.attendee[i].ygmc+'</a>'
                        }
                    }
                    $(".mDetailInfo").html(res.data.hygy);
                    $(".mCyInfo").html(str);
                    $(".hzBtn").attr("hzid",res.data.hzid);
                    $(".hzzt").html(res.data.hzzt);
                    if(res.data.state=='2'||res.data.state=='3'){
                        $("#descInfo").show();
                        $("#descInfo").val(res.data.remark)
                    }
                    $(".hzBtn").on("click",function () {
                        layer.open({
                            type:1,
                            content: $("#hzCon"),
                            btn: ['参加', '不参加'],
                            yes: function(index){//参加2
                                //location.reload();
                                hz('2');
                                layer.close(index);

                            },
                            btn2: function(index){//不参加 3
                                if($("#desc").val()==""){
                                    layer.msg("请填写不参加原因！");
                                    return false;
                                }
                                hz('3');
                                layer.close(index);
                            }
                        });

                    });

                    $(".detailBtn").on("click",function () {
                        document.location.href = "meetingMx.html"
                    })

                }

            }
        });
    })
});
function hz(state) {
    var hzid = $(".hzBtn").attr('hzid');
    var message = $("#desc").val();
    $.ajax({
        type: "post",
        url: "http://sge.cn:9106/api/meeting/reply",
        data: {
            hzid: hzid,
            message: message,
            state:state
        },
        success:function (res) {
            if(res.code=='200'){
                layer.msg("回执成功！");
                if(state=='2'){
                    $("#descInfo").val($("#desc").val())
                }else{
                    $("#descInfo").val($("#desc").val())
                }
                location.reload();
            }
        }
    })
}
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