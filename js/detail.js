var paramsObj=getRequestParams();
var ygbm = paramsObj.ygbm || "";
var hyid = paramsObj.hyid || "";
var signin;
var meetingSignin = function(token){
    $.ajax({
        type: "post",
        url: "https://wx.hongyancloud.com/api/meeting/signin",
        data: {
            token: token,
            ygbm: ygbm,
            hyid: hyid
        },
        success: function (res) {
            if(res.code == 200) {
                layer.msg('签到成功');
                $(".signinBtn").html('已签到').off('click');
            } else {
                layer.alert(res.message, {icon: 2, btnAlign: 'c', closeBtn: 0});
            }
        },
        error: function (request, error) {
            layer.alert(error, {icon: 2, btnAlign: 'c', closeBtn: 0});
        }
    })
}
$(function () {
    layui.use('layer', function() {
        // var $ = layui.jquery;
        var layer = layui.layer;
        $.ajax({
            type: "post",
            url: "https://wx.hongyancloud.com/api/meeting/info",
            data: {
                hyid: hyid,
                ygbm: ygbm
            },
            success: function (res) {
                if(res.code=='200'){
                    signin = res.data.signin;
                    $(".mDetailTop h1").html(res.data.hytitle);
                    $(".kssj").html("开始 " + res.data.kssj);
                    $(".jssj").html("结束 " + res.data.jssj);
                    $(".mZj .zjr").html(res.data.zjr);
                    $(".address").html(res.data.hyaddr);
                    $(".hymc").html(res.data.hymc);
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
                    });
                    if (signin) {
                        $(".signinBtn").html('已签到').off('click');
                    } else {
                        if(!dd) {
                            $(".signinBtn").click(function () {
                                alert("call camera");
                            })
                        }
                    }
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
        url: "https://wx.hongyancloud.com/api/meeting/reply",
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
