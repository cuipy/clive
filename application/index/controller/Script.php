<?php
namespace app\index\controller;

use think\Controller;
use think\Request;
use think\Session;

class Script extends Controller
{

    /**
     * @route('kefu.js')
     */
    public function kefu()
    {
        $key = input('get.key');
        // 空，或者元素选择器，# = %23
        $container = input('get.container');
        $icon_width = input('get.icon_width');
        $text_width = input('get.text_width');

        print <<<EOT
var dqurl="http://clive.pingbuwang.com";
var kefu_key="$key";
var kefu_container="$container";
var kefu_icon_width=parseInt("$icon_width");
var kefu_text_width=parseInt("$text_width");

if(isNaN(kefu_icon_width)||kefu_icon_width<=0){
    kefu_icon_width=47;
}
if(isNaN(kefu_text_width)||kefu_text_width<=0){
    kefu_text_width=112;
}
var kefu_box_width=kefu_icon_width+kefu_text_width+4;

document.write('<script src="'+dqurl+'/static/customer/js/layer/layer.js"></script>');
document.write('<script src="'+dqurl+'/static/customer/js/clive-tool.js"></script>');

$(function() {
    var url=dqurl+'/index/index/kfys_ajax';
    $.ajax({
        type: 'POST',
        url: url,
        data: {
            mst: 1,key: kefu_key
        },
        dataType: 'json',
        success: function (data) {
            if (data.code == 1) {
                var groupslist = data.groupslist;

                
                    var ab = '<div id="kefu_service">'
                        +'<ul>'

                    for (var i = 0; i < groupslist.length; i++) {
                        ab +=
                            '<li title="'+groupslist[i]['name']+'">'
                            + '<a class="kefu_box" href="javascript:;">'
                            + '<div class="kefu_img">'
                            + '<img src="' + dqurl + '/static/demo/images/l04.png">'
                            + '</div>'
                            + '<div class="kefu_text" data-group="' + groupslist[i]['id'] + '">'
                            + '<span >' + groupslist[i]['name'] + '</span>'
                            + '</div>'
                            + '</a>'
                            + '</li>'
                    }
                    ab+='</ul></div>';
                if(kefu_container==''||$(kefu_container)[0]==null){
                    $(document.body).append(ab);
                }else{
                    $(kefu_container).append(ab);
                }

            }
           
            var ws = new clive();
            var uid = parseInt(Math.random() * 40) + 1;

            $("#kefu_service .kefu_box").click(function(){
                var group = $(this).attr('data-group');
                ws.init({
                    id: uid,
                    url: dqurl,
                    name: '会员' + uid,
                    avatar: dqurl+'/uploads/20180914/6ae4336bf5e3e79804d9ded9771a8f0b.jpg',
                    group: group
                });
            });
        }
    })

});

var cssScript="<style type='text/css'>#kefu_service *{box-sizing:border-box}";

// 在右侧靠边栏
if(kefu_container==''||$(kefu_container)[0]==null){
    cssScript+="#kefu_service{position: fixed;top: 350px;right: 0px;z-index: 10002;}";
    cssScript+="#kefu_service ul{list-style: none;margin: 0;padding: 0;}";
    cssScript+="#kefu_service .kefu_box{display:block;width:"+kefu_box_width+"px;text-decoration: none;display:flex}";
    cssScript+="#kefu_service .kefu_img{width:"+kefu_icon_width+"px;height:"+kefu_icon_width+"px;overflow: hidden;}";
    cssScript+="#kefu_service .kefu_img img{width:100%;}";
    cssScript+="#kefu_service .kefu_text{color:#007bc4;background-color: #A7D2A9;width:"+kefu_text_width+"px;height:"+kefu_icon_width+"px;line-height:"+kefu_icon_width+"px;border: 1px solid #8BC48D;text-align: center;}";
    
}else{
// 停靠在某容器中
    cssScript+="#kefu_service{}";
    cssScript+="#kefu_service ul{list-style: none;margin: 0;padding: 0;display:flex}";
    cssScript+="#kefu_service li{margin-right:4px}";
    cssScript+="#kefu_service .kefu_box{display:block;text-decoration: none;display:flex}";
    cssScript+="#kefu_service .kefu_img{width:"+kefu_icon_width+"px;height:"+kefu_icon_width+"px;overflow: hidden;}";
    cssScript+="#kefu_service .kefu_img img{width:100%;}";
    cssScript+="#kefu_service .kefu_text{display:none}";
    
}
cssScript+="</style>";

document.write(cssScript);

EOT;

    }

}
