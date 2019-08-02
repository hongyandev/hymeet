var paramsObj=getRequestParams();
var ygbm = paramsObj.ygbm || "";
var hyid = paramsObj.hyid || "";
var signin;
var openLink = function(url, params){
    if (url) {
        if (params) {
            var paras = '';
            Object.keys(params).forEach(function(key){
                paras += paras === '' ? key + '=' + params[key] : '&' + key + '=' + params[key];
            });
            url += url.lastIndexOf('?') == -1 ? '?' + paras : '&' + paras;
        }
        if(dd) {
            dd.ready(function () {
                dd.biz.util.openLink({
                    url: url,//要打开链接的地址
                    onSuccess : function(result) {},
                    onFail : function(err) {}
                })
            })
        } else {
            location.href=url;
        }
    }
}
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
                layer.msg('签到成功', {icon: 1});
                $(".signinBtn").removeClass('dd_blue').addClass('gray').html('已签到').off('click');
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
        var layer = layui.layer;
        var shade = layer.load(3,{shade:[0.12,'#191f25']});
        $.ajax({
            type: "post",
            url: "https://wx.hongyancloud.com/api/meeting/info",
            data: {
                appKey: 'ding7mtvnn9qm85dbwfm',
                hyid: hyid,
                ygbm: ygbm
            },
            success: function (res) {
                layer.close(shade);
                if(res.code=='200'){
                    signin = res.data.signin;
                    $(".mDetailTop h1").html(res.data.hytitle);
                    $(".kssj").html("开始 " + res.data.kssj);
                    $(".jssj").html("结束 " + res.data.jssj);
                    $(".mZj .zjr").html(converUserLink(res.data.zjr_dd_id,res.data.zjr));
                    $(".mZj .lxr").html(converUserLink(res.data.lxr_dd_id,res.data.lxr));
                    $(".address").html(res.data.hyaddr);
                    $(".hymc").html(res.data.hymc);
                    $(".mDetailInfo").html(res.data.hygy);
                    $(".attendee").html('<a href="meetingAttendee.html?hyid=' + hyid + '&ygbm=' + ygbm + '&dd_chatid=' + res.data.dd_chatid + '">' + res.data.attendee_count + ' 人<span class="gray40" style="margin: 0px 10px">回执 ' + res.data.attendee_reply + ' 人，签到 ' + res.data.attendee_signin + ' 人</span><i style="font-weight:bold" class="layui-icon layui-icon-right"></i></a>')
                    $(".hzBtn").attr("hzid",res.data.hzid);
                    $(".hzzt").html(res.data.hzzt);
                    var hyzl = "";
                    if(res.data.hyzl && res.data.hyzl.length > 0){
                        $.each(res.data.hyzl, function (index, item) {
                            hyzl += "<li><a href=\"javascript:openLink('"+item.url+"', {dd_orientation: 'auto'})\">"+item.hyname+"</a></li>"
                        });
                        $(".hyxq").html(hyzl);
                    }
                    if(res.data.state=='2'||res.data.state=='3'){
                        $("#descInfo").show();
                        $("#descInfo").html(res.data.remark)
                    }
                    $(".hzBtn").on("click",function () {
                        layer.open({
                            title: '回执内容',
                            type:1,
                            btnAlign: 'c',
                            area: '80%',
                            shadeClose: true,
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
                        $(".signinBtn").removeClass('dd_blue').addClass('gray').html('已签到').off('click');
                    }
                }
            },
            error: function (request, error) {
                layer.close(shade);
                layer.alert(error, {icon: 2, btnAlign: 'c', closeBtn: 0});
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
