//注意：选项卡 依赖 element 模块，否则无法进行功能性操作
$(function () {
    layui.use(['element','table'], function(){
        var $ = layui.jquery;
        var element = layui.element; //Tab的切换功能，切换事件监听等，需要依赖element模块
        var table = layui.table;
        table.render({
            elem: '#table1',
            height: 312,
            cellMinWidth:40,
            url: '/demo/table/user/', //数据接口
            page: true, //开启分页
            cols: [[ //表头
                {field: 'id', title: 'ID'},
                {field: 'username', title: '用户名'},
                {field: 'sex', title: '性别'},
                {field: 'city', title: '城市'},
                {field: 'sign', title: '签名'},
                {field: 'experience', title: '积分'},
                {field: 'score', title: '评分'},
                {field: 'classify', title: '职业'},
                {field: 'wealth', title: '财富'},
                {field: 'abc', title: '123'},
                {field: 'bcd', title: '345'},
                {field: 'address', title: '地址'},
                {field: 'def', title: '567'},
                {field: 'efg', title: '678'},
                {field: 'fgh', title: '789'}
            ]]
        });
        element.on('tab(all)', function(data){
            console.log(data.index);
            if(data.index == 0){
               // console.log("内容1");
                table.render({
                    elem: '#table1',
                    height: 312,
                    url: '/demo/table/user/', //数据接口
                    page: true, //开启分页
                    cols: [[ //表头
                        {field: 'id', title: 'ID'},
                        {field: 'username', title: '用户名'},
                        {field: 'sex', title: '性别'},
                        {field: 'city', title: '城市'},
                        {field: 'sign', title: '签名'},
                        {field: 'experience', title: '积分'},
                        {field: 'score', title: '评分'},
                        {field: 'classify', title: '职业'},
                        {field: 'wealth', title: '财富'}
                    ]]
                });
            } else if(data.index == 1){
               // console.log("内容2");
            }
        });
        componentWillMount();
        componentDidMount()


    });

});

function componentDidMount() {
    this.renderResize();
}

function renderResize() {
    var width = document.documentElement.clientWidth;
    var height =  document.documentElement.clientHeight;
    // 通过判断屏幕的宽高比来判断是横屏害死竖屏，若是竖屏则提示
   // var self = this;
    if( width < height ){
        layer.msg("建议横屏显示，马上设置");
    }
}

function componentWillMount() {
    // 需要在横竖屏切换时给出提示，所以添加了监听事件，一开始我是监听了orientationchange事件，但是有时会失效，判断失误，所以就监听了resize事件
    window.addEventListener("resize", this.renderResize, false);
}


