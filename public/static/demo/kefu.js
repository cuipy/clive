
var dqurl='http://zl.dakanggou.com:8066';
document.write("<script src="+dqurl+"/static/admin/js/content.min.js?v=1.0.0></script><script src="+dqurl+"/static/customer/js/layer/layer.js></script><script src="+dqurl+"/static/customer/js/clive-tool.js></script>");
    document.write(
        '<div id="service" style="width: 161px;height: 290px;position: fixed;top: 350px;right: 0px;z-index: 100;">'
        +'<ul style="list-style: none;">'
        +'<li style="width: 161px;height: 60px;">'
        +'<a href="javascript:;" style="height: 49px;float: right;display: block;min-width: 47px;max-width: 161px;color: #007bc4;text-decoration: none;cursor: pointer;">'
        +'<div class="hides" style="width:161px;display:none;cursor: pointer;">'
        +'<div class="hides p1" style="margin-right: -143px;cursor: pointer;width: 47px;height: 49px;float: left;">'
        +'<img src='+dqurl+'/static/demo/images/ll04.png style="float: right;border: 0;cursor: pointer;">'
        +'</div>'
        +'<div class="hides p2" id="buy-1" data-group="1" style="margin-right: -143px;cursor: pointer;width: 112px;background-color: #A7D2A9;height: 47px;margin-left: 47px;border: 1px solid #8BC48D;text-align: center;line-height: 47px;">'
        +'<span style="color:#FFF;font-size:13px">售前客服</span>'
        +'</div>'
        +'</div>'
        +'<img src='+dqurl+'/static/demo/images/l04.png width="47" height="49" class="shows" style="float: right;border: 0;cursor: pointer;"/>'
        +'</a>'
        +'</li>'
        +'<li style="width: 161px;height: 60px;">'
        +'<a href="javascript:;" style="height: 49px;float: right;display: block;min-width: 47px;max-width: 161px;color: #007bc4;text-decoration: none;cursor: pointer;">'
        +'<div class="hides" style="width:161px;display:none;margin-right: -143px;cursor: pointer;">'
        +'<div class="hides p1" style="margin-right: -143px;cursor: pointer;width: 47px;height: 49px;float: left;">'
        +'<img src='+dqurl+'/static/demo/images/ll04.png style="float: right;border: 0;cursor: pointer;">'
        +'</div>'
        +'<div class="hides p2" id="buy-2" data-group="2" style="margin-right: -143px;cursor: pointer;width: 112px;background-color: #A7D2A9;height: 47px;margin-left: 47px;border: 1px solid #8BC48D;text-align: center;line-height: 47px;">'
        +'<span style="color:#FFF;font-size:13px">售后客服</span>'
        +'</div>'
        +'</div>'
        +'<img src='+dqurl+'/static/demo/images/l04.png width="47" height="49" class="shows" style="display: block;float: right;border: 0;cursor: pointer;"/>'
        +'</a>'
        +'</li>'
        +'</ul>'
        +'</div>'
    )
 $(function() {
    $("#service a").hover(function() {
        if ($(this).prop("className") == "weixin_area") {
            $(this).children("img.hides").show();
        } else {
            $(this).children("div.hides").show();
            $(this).children("img.shows").hide();
            $(this).children("div.hides").animate({marginRight: '0px'}, '0');
        }
    }, function() {
        if ($(this).prop("className") == "weixin_area") {
            $(this).children("img.hides").hide();
        } else {
            $(this).children("div.hides").animate({marginRight: '-163px'}, 0, function() {
                $(this).hide();
                $(this).next("img.shows").show();
            });
        }
    });
    var ws = new clive();
    var uid = parseInt(Math.random() * 40) + 1;

    $("#buy-1,#buy-2").click(function(){
        var group = $(this).attr('data-group');
        ws.init({
            id: uid,
            url: dqurl,
            name: '会员' + uid,
            avatar: 'http://wx2.sinaimg.cn/mw690/5db11ff4gy1flxmew7edlj203d03wt8n.jpg',
            group: group
        });
    });
});
