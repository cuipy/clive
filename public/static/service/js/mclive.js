var uinfo = {
    id:  'KF' + uid,
    username: uname,
    avatar: avatar,
    group: group
};

// 创建一个Socket实例
var socket = new WebSocket('wss://' + socket_server);

// 打开Socket 
socket.onopen = function (res) {
    layui.use(['layer'], function () {
        var layer = layui.layer;
        layer.ready(function () {
            layer.msg('链接成功', {time: 1000});
        });
    });
    // 登录
    var login_data = '{"type":"init", "uid":"' + uinfo.id + '", "name" : "' + uinfo.username + '", "avatar" : "'
        + uinfo.avatar + '", "group": ' + uinfo.group + '}';
    socket.send(login_data);
};

// 监听消息
socket.onmessage = function (res) {
    var data = eval("(" + res.data + ")");
    switch (data['message_type']) {
        // 服务端ping客户端
        case 'ping':
            socket.send('{"type":"ping"}');
            break;
        // 添加用户
        case 'connect':
            addUser(data.data.user_info);
            break;
        // 移除访客到主面板
        case 'delUser':
            delUser(data.data);
            break;
        // 监测聊天数据
        case 'chatMessage':
            showUserMessage(data.data, data.data.content);
            break;
    }
};

// 监听失败
socket.onerror = function(err){

    layer.alert('连接失败,请联系管理员', {icon: 2, title: '错误提示'});
};

$(function () {
    // 获取服务用户列表
    $.getJSON('/service/index/getUserList', function(res){
        if(1 == res.code && res.data.length > 0){
            $.each(res.data, function(k, v){
                addUser(v);
            });

            var id = $(".layui-tab-title").find('li').eq(0).data('id');
            var name = $(".layui-tab-title").find('li').eq(0).data('name');
            var avatar = $(".layui-tab-title").find('li').eq(0).data('avatar');
            var ip = $(".layui-tab-title").find('li').eq(0).data('ip');

            // 默认设置第一个用户为当前对话的用户
            $("#active-user").attr('data-id', id).attr('data-name', name).attr('data-avatar', avatar).attr('data-ip', ip);

            $(".layui-tab-title").find('li').eq(0).addClass('active').find('span:eq(1)').removeClass('layui-badge').text('');
            $("#f-user").val(name);
            $("#f-ip").val(ip);

            $.getJSON('/service/index/getCity', {ip: ip}, function(res){
                $("#f-area").val(res.data);
            });

            // 拉取和这个人的聊天记录
            $("#u-" + id).show();
            getChatLog(id, 1);
        }
    });

    // 监听快捷键发送
    document.getElementById('msg-area').addEventListener('keydown', function (e) {
        if (e.keyCode != 13) return;
        e.preventDefault();  // 取消事件的默认动作
        sendMessage();
    });

    // 点击表情
    var index;
    $("#face").click(function (e) {
        e.stopPropagation();
        layui.use(['layer'], function () {
            var layer = layui.layer;

            var isShow = $(".layui-whisper-face").css('display');
            if ('block' == isShow) {
                layer.close(index);
                return;
            }
            var height = $(".chat-box").height() - 110;
            layer.ready(function () {
                index = layer.open({
                    type: 1,
                    offset: [height + 'px', $(".layui-side").width() + 'px'],
                    shade: false,
                    title: false,
                    closeBtn: 0,
                    area: '395px',
                    content: showFaces()
                });
            });
        });
    });

    $(document).click(function (e) {
        layui.use(['layer'], function () {
            var layer = layui.layer;
            if (isShow) {
                layer.close(index);
                return false;
            }
        });
    });

    // 发送消息
    $("#send").click(function () {
        sendMessage();
    });

    // hover用户
    $(".layui-tab-title li").hover(function () {
        $(this).find('i').show();
    }, function () {
        $(this).find('i').hide();
    });

    // 检测滚动，异步加载更多聊天数据
    $(".chat-box").scroll(function () {
        var top = $(".chat-box").scrollTop();
    });

    // 会员转接
    $("#scroll-link").click(function(){

        var id = $("#active-user").attr('data-id');
        var name = $("#active-user").attr('data-name');
        var avatar = $("#active-user").attr('data-avatar');
        var ip = $("#active-user").attr('data-ip');

        if(id == '' || name == ''){
            layer.msg("请选择要转接的会员");
        }

        // 二次确认
        var layerIndex = null;
        layerIndex = layer.confirm('确定转接 ' + name + ' ？', {
            title: '转接提示',
            closeBtn: 0,
            icon: 3,
            btn: ['确定', '取消'] // 按钮
        }, function(){
            layer.close(layerIndex);
            layerIndex = layer.open({
                title: '',
                type: 1,
                area: ['30%', '40%'],
                content: $("#change-box")
            });

            // 监听选择
            layui.use(['form'], function(){
                var form = layui.form;

                form.on('select(group)', function (data) {
                    if(uinfo.group == data.value){
                        layer.msg("已经在该分组，不需要转接！");
                    }else{

                        layer.close(layerIndex);
                        var group = data.value; // 分组
                        // 交换分组
                        var change_data = '{"type":"changeGroup", "uid":"' + id + '", "name" : "' + name + '", "avatar" : "'
                            + avatar + '", "group": ' + group + ', "ip" : "' + ip + '"}';

                        socket.send(change_data);

                        // 将该会员从我的会话中移除
                        delUser({id: id});

                        layer.msg('转接成功');
                    }
                });
            });

        }, function(){

        });
    });

    // 处理粘贴事件
    listenPaste();

    // 截图提示
    $("#cut").mouseover(function(){
        layer.tips('将您剪切好的图片粘贴到输入框即可', "#cut", {tips: 1});
    });
});

var isShow = false;

layui.use(['element', 'form'], function () {
    var element = layui.element;
    var form = layui.form;
});

// 图片 文件上传
layui.use(['upload', 'layer'], function () {
    var upload = layui.upload;
    var layer = layui.layer;

    // 执行实例
    var uploadInstImg = upload.render({
        elem: '#image' // 绑定元素
        , accept: 'images'
        , exts: 'jpg|jpeg|png|gif'
        , url: '/service/upload/uploadImg' // 上传接口
        , done: function (res) {

            sendMessage('img[' + res.data.src + ']');
            showBigPic();
        }
        , error: function () {
            // 请求异常回调
        }
    });

    var uploadInstFile = upload.render({
        elem: '#file' // 绑定元素
        , accept: 'file'
        , exts: 'zip|rar'
        , url: '/service/upload/uploadFile' // 上传接口
        , done: function (res) {
            sendMessage('file(' + res.data.src + ')[' + res.msg + ']');
        }
        , error: function () {
            // 请求异常回调
        }
    });
});

// 展示表情数据
function showFaces() {
    isShow = true;
    var alt = getFacesIcon();
    var _html = '<div class="layui-whisper-face"><ul class="layui-clear whisper-face-list">';
    layui.each(alt, function (index, item) {
        _html += '<li title="' + item + '" onclick="checkFace(this)"><img src="/static/service/js/layui/images/face/' + index + '.gif" /></li>';
    });
    _html += '</ul></div>';

    return _html;
}

// 选择表情
function checkFace(obj) {
    var word = $(".msg-area").val() + ' face' + $(obj).attr('title') + ' ';
    $(".msg-area").val(word).focus();
}

// 发送消息
function sendMessage(sendMsg) {
    var msg = (typeof(sendMsg) == 'undefined') ? $(".msg-area").val() : sendMsg;
    if ('' == msg) {
        layui.use(['layer'], function () {
            var layer = layui.layer;
            return layer.msg('请输入回复内容', {time: 1000});
        });
        return false;
    }

    var word = msgFactory(msg, 'mine', uinfo);
    var uid = $("#active-user").attr('data-id');
    // 用户被关闭之后,如果当前会话用户是 激活用户的话，将此标志位设为 -999
    // 这里通过判断这个，来防止发送
    if(-999 == uid){
        $(".msg-area").val('');
        return ;
    }
    var uname = $("#active-user").attr('data-name');

    socket.send(JSON.stringify({
        type: 'chatMessage',
        data: {to_id: uid, to_name: uname, content: msg, from_name: uinfo.username,
            from_id: uinfo.id, from_avatar: uinfo.avatar}
    }));

    $("#u-" + uid).append(word);
    $(".msg-area").val('');
    // 滚动条自动定位到最底端
    wordBottom();
}

// 展示客服发送来的消息
function showUserMessage(uinfo, content) {
    if ($('#f-' + uinfo.id).length == 0) {
        addUser(uinfo);
    }

    // 未读条数计数
    if (!$('#f-' + uinfo.id).hasClass('active')) {
        var num = $('#f-' + uinfo.id).find('span:eq(1)').text();
        if (num == '') num = 0;
        num = parseInt(num) + 1;
        $('#f-' + uinfo.id).find('span:eq(1)').removeClass('layui-badge').addClass('layui-badge').text(num);
    }

    // 声音提醒
    voice();

    var word = msgFactory(content, 'user', uinfo);
    setTimeout(function () {
        $("#u-" + uinfo.id).append(word);
        // 滚动条自动定位到最底端
        wordBottom();

        showBigPic();
    }, 200);
}

// 消息发送工厂
function msgFactory(content, type, uinfo) {
    var _html = '';
    if ('mine' == type) {
        _html += '<li class="whisper-chat-mine">';
    } else {
        _html += '<li>';
    }
    _html += '<div class="whisper-chat-user">';
    _html += '<img src="' + uinfo.avatar + '">';
    if ('mine' == type) {
        _html += '<cite><i>' + getDate() + '</i>' + uinfo.username + '</cite>';
    } else {
        _html += '<cite>' + uinfo.name + '<i>' + getDate() + '</i></cite>';
    }
    _html += '</div><div class="whisper-chat-text">' + replaceContent(content) + '</div>';
    _html += '</li>';

    return _html;
}

// 获取日期
function getDate() {
    var d = new Date(new Date());

    return d.getFullYear() + '-' + digit(d.getMonth() + 1) + '-' + digit(d.getDate())
        + ' ' + digit(d.getHours()) + ':' + digit(d.getMinutes()) + ':' + digit(d.getSeconds());
}

//补齐数位
var digit = function (num) {
    return num < 10 ? '0' + (num | 0) : num;
};

// 滚动条自动定位到最底端
function wordBottom() {
    var box = $(".chat-box");
    box.scrollTop(box[0].scrollHeight);
}

// 切换在线用户
function changeUserTab(obj) {
    obj.addClass('active').siblings().removeClass('active');
    wordBottom();
}

// 添加用户到面板
function addUser(data) {

    var _html = '<li class="" data-id="' + data.id + '" id="f-' + data.id +
        '" data-name="' + data.name + '" data-avatar="' + data.avatar + '" data-ip="' + data.ip + '">';
    _html += '<span class="user-name">' + data.name + '</span>';
    _html += '<span class="layui-badge" style="margin-left:5px">0</span>';
    _html += '<i class="layui-icon close">&#x1006;</i>';
    _html += '</li>';

    // 如果没有选中人，选中第一个
    var hasActive = 0;
    var isIn = 0;
    $("#user_list li").each(function(){
        if($(this).hasClass('active')){
            hasActive = 1;
        }

        if($(this).attr('data-id') == data.id){
            isIn = 1;
        }
    });

    // 已经添加过了
    if(1 == isIn){
        return ;
    }

    // 添加左侧列表
    $("#user_list").append(_html);

    var _html2 = '';
    _html2 += '<ul id="u-' + data.id + '">';
    _html2 += '</ul>';
    // 添加主聊天面板
    $('.chat-box').append(_html2);

    if(0 == hasActive){
        $("#user_list").find('li').eq(0).addClass('active').find('span:eq(1)').removeClass('layui-badge').text('');
        $("#u-" + data.id).show();

        var id = $(".layui-tab-title").find('li').eq(0).data('id');
        var name = $(".layui-tab-title").find('li').eq(0).data('name');
        var ip = $(".layui-tab-title").find('li').eq(0).data('ip');
        var avatar = $(".layui-tab-title").find('li').eq(0).data('avatar');

        // 设置当前会话用户
        $("#active-user").attr('data-id', id).attr('data-name', name).attr('data-avatar', avatar).attr('data-ip', ip);

        $("#f-user").val(name);
        $("#f-ip").val(ip);

        $.getJSON('/service/index/getCity', {ip: ip}, function(res){
            $("#f-area").val(res.data);
        });
    }
    // 展示聊天记录
    getChatLog(data.id, 1);
    // 触发选择用户
    checkUser();
    // 触发关闭用户
    closeUser();
}

// 操作新连接用户的 dom操作
function checkUser() {

    $(".layui-tab-title").find('li').unbind("click"); // 防止事件叠加
    // 切换用户
    $(".layui-tab-title").find('li').bind('click', function () {
        changeUserTab($(this));
        var uid = $(this).data('id');
        var avatar = $(this).data('avatar');
        var name = $(this).data('name');
        var ip = $(this).data('ip');
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

        getChatLog(uid, 1);

        wordBottom();
    });
}

// 删除用户聊天面板
function delUser(data) {
    $("#f-" + data.id).remove(); // 清除左侧的用户列表
    $('#u-' + data.id).remove(); // 清除右侧的聊天详情
}

// 发送快捷语句
function sendWord(obj) {
    var msg = $(obj).data('word');
    sendMessage(msg);
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
                    _html += '<li class="whisper-chat-mine">';
                } else {
                    _html += '<li>';
                }
                _html += '<div class="whisper-chat-user">';
                _html += '<img src="' + v.from_avatar + '">';
                if ('mine' == v.type) {
                    _html += '<cite><i>' + v.time_line + '</i>' + v.from_name + '</cite>';
                } else {
                    _html += '<cite>' + v.from_name + '<i>' + v.time_line + '</i></cite>';
                }
                _html += '</div><div class="whisper-chat-text">' + replaceContent(v.content) + '</div>';
                _html += '</li>';
            }

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

// 显示大图
function showBigPic(){

    $(".layui-whisper-photos").on('click', function () {
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

// 获取更多的的记录
function getMore(obj){
    $(obj).remove();

    var page = $(obj).attr('data-page');
    var uid = $(".layui-tab-title").find('li').eq(0).data('id');
    getChatLog(uid, page, 1);
}

// 消息声音提醒
var voice = function() {
    var audio = document.createElement("audio");
    audio.src = '/static/service/js/layui/css/modules/layim/voice/default.mp3';
    audio.play();
};

// 监听粘贴事件
var listenPaste = function () {
    // 监听粘贴事件
    document.getElementById('msg-area').addEventListener('paste', function(e){

        // 添加到事件对象中的访问系统剪贴板的接口
        var clipboardData = e.clipboardData,
            i = 0,
            items, item, types;

        if (clipboardData) {
            items = clipboardData.items;
            if (!items) {
                return;
            }
            item = items[0];
            // 保存在剪贴板中的数据类型
            types = clipboardData.types || [];
            for (; i < types.length; i++) {
                if (types[i] === 'Files') {
                    item = items[i];
                    break;
                }
            }

            // 判断是否为图片数据
            if (item && item.kind === 'file' && item.type.match(/^image\//i)) {

                var fileType = [
                    'image/jpg',
                    'image/png',
                    'image/jpeg',
                    'image/gif'
                ];

                if(-1 == $.inArray(item.type, fileType)){
                    layer.msg("只支持jpg,jpeg,png,gif");
                    return false;
                }

                var fileType = item.type.lastIndexOf('/');
                var suffix = item.type.substring(fileType+1, item.type.length);

                var blob = item.getAsFile();
                var fileName =  new Date().valueOf() + '.' + suffix;

                var formData = new FormData();
                formData.append('name', fileName);
                formData.append('file', blob);

                var request = new XMLHttpRequest();

                request.onreadystatechange = function() {
                    if (request.readyState == 4 && request.status == 200) {
                        var res = eval('(' + request.response + ')');
                        if(res.code == 0){
                            $("#msg-area").val('img['+ (res.data.src||'') +']');
                            //sendMessage();
                        } else {
                            layer.msg(res.msg||'粘贴失败');
                        }
                    }
                };
                // upload error callback
                request.upload.onerror = function(error) {
                    layer.msg(res.msg||'粘贴失败');
                };
                // upload abort callback
                request.upload.onabort = function(error) {
                    layer.msg(res.msg||'粘贴失败');
                };

                request.open('POST', '/index/upload/uploadImg');
                request.send(formData);

                //imgReader(item, data.id);
            }
        }

    });
};

// 关闭用户
var closeUser = function(){

    $('.close').click(function () {

        var uid = $(this).parent().data('id');
        var activeUid = $("#active-user").attr('data-id');
        if(uid == activeUid){
            $("#active-user").attr('data-id', -999);
        }

        socket.send(JSON.stringify({
            type: 'closeUser', uid: uid
        }));

        $(this).parent().remove(); // 清除左侧的用户列表
        $('#u-' + uid).remove(); // 清除右侧的聊天详情
    });
};

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