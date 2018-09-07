function checkUser() {
    $(".layui-unselect").find('li').unbind("click"); // 防止事件叠加
    // 切换用户
    $(".layui-unselect").find('li').bind('click', function () {
        changeUserTab($(this));
        var uid = $(this).data('id');
        var avatar = $(this).data('avatar');
        var name = $(this).data('name');
        var ip = $(this).data('ip');
        var start_time = $(this).data('start_time');
        var _html2 = '';
        _html2 += '<ul id="u-' + uid  + '">';
        _html2 += '</ul>';
        // 添加主聊天面板
        $('.chat-box').append(_html2);
        // 展示相应的对话信息
        $('.chat-box ul').each(function () {
            if ('u-' + uid == $(this).attr('id')) {
                $(this).addClass('show-chat-detail').siblings().removeClass('show-chat-detail').attr('style', '');
                return false;
            }
        });
        // 去除消息提示
        $(this).find('span').eq(1).removeClass('layui-badge').text('');

        // 设置当前会话的用户
        $("#active-user").attr('data-id', uid).attr('data-name', name).attr('data-avatar', avatar).attr('data-ip', ip);

        // 右侧展示详情
        $("#f-user").val(name);
        $("#f-ip").val(ip);
        $.getJSON('/service/index/getCity', {ip: ip}, function(res){
            $("#f-area").val(res.data);
        });
        $.getJSON('/service/index/gettime', {start_time: start_time}, function(res){
            $("#f-time").val(res.data);
        });
        getChatLog(uid, 1);
        console.log(uid);
        wordBottom();
    });
}
// 显示大图
function showBigPic(){

    $(".layui-clive-photos").on('click', function () {
        var src = this.src;
        layer.photos({
            photos: {
                data: [{
                    "alt": "大图模式",
                    "src": src
                }]
            }
            , shade: 0.5
            , closeBtn: 2
            , anim: 0
            , resize: false
            , success: function (layero, index) {

            }
        });
    });
}
// 获取聊天记录
function getChatLog(uid, page, flag) {

    $.getJSON('/service/index/getChatLog', {uid: uid, page: page}, function(res){
        if(1 == res.code && res.data.length > 0){

            if(res.msg == res.total){
                var _html = '<div class="layui-flow-more">没有更多了</div>';
            }else{
                var _html = '<div class="layui-flow-more"><a href="javascript:;" data-page="' + parseInt(res.msg + 1)
                    + '" onclick="getMore(this)"><cite>更多记录</cite></a></div>';
            }

            var len = res.data.length;

            for(var i = 0; i < len; i++){
                var v = res.data[len - i - 1];
                if ('mine' == v.type) {
                    _html += '<li class="clive-chat-mine">';
                } else {
                    _html += '<li>';
                }
                _html += '<div class="clive-chat-user">';
                _html += '<img src="' + v.from_avatar + '">';
                if ('mine' == v.type) {
                    _html += '<cite><i>' + v.time_line + '</i>' + v.from_name + '</cite>';
                } else {
                    _html += '<cite>' + v.from_name + '<i>' + v.time_line + '</i></cite>';
                }
                _html += '</div><div class="clive-chat-text">' + replaceContent(v.content) + '</div>';
                _html += '</li>';
            }
            console.log(_html);
            setTimeout(function () {
                // 滚动条自动定位到最底端
                if(typeof flag == 'undefined'){
                    $("#u-" + uid).html(_html);
                    wordBottom();
                }else{
                    $("#u-" + uid).prepend(_html);
                }

                showBigPic();
            }, 100);
        }
    });
}
// 打卡下班
var loginOut = function(){

    layer.msg("正在关闭,未咨询完的用户", {time: 50000});
    var len = $("#user_list li").length;
    var closeNum = 0;

    if(len == closeNum){
        window.location.href = '/service/login/loginOut';
    }

    $("#user_list li").each(function(){

        var uid = $(this).data('id');
        var activeUid = $("#active-user").attr('data-id');
        if(uid == activeUid){
            $("#active-user").attr('data-id', -999);
        }

        socket.send(JSON.stringify({
            type: 'closeUser', uid: uid
        }));

        $(this).parent().remove(); // 清除左侧的用户列表
        $('#u-' + uid).remove(); // 清除右侧的聊天详情

        closeNum++;
        if(closeNum == len){

            socket.send(JSON.stringify({
                type: 'closeKf', uid: uid
            }));

            setTimeout(function(){
                window.location.href = '/service/login/loginOut';
            }, 1500);

        }
    });
};

// 获取更多的的记录
function getMore(obj){
    $(obj).remove();

    var page = $(obj).attr('data-page');
    var uid = $(".layui-unselect").find('li').eq(0).data('id');
    getChatLog(uid, page, 1);
}
function changeUserTab(obj) {
    obj.addClass('active').siblings().removeClass('active');
    wordBottom();
}
function wordBottom() {
    var box = $(".chat-box");
    box.scrollTop(box[0].scrollHeight);
}
checkUser();