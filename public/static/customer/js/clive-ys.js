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
                var ab = '';
                for (var i = 0; i < groupslist.length; i++) {
                    ab +=
                        '<li style="width: 161px;height: 60px;">'
                        + '<a href="javascript:;" style="height: 49px;float: right;display: block;min-width: 47px;max-width: 161px;color: #007bc4;text-decoration: none;cursor: pointer;">'
                        + '<div class="hides" style="width:161px;display:none;cursor: pointer;">'
                        + '<div class="hides " style="margin-right: -143px;cursor: pointer;width: 47px;height: 49px;float: left;">'
                        + '<img src=' + dqurl + '/static/demo/images/ll04.png style="float: right;border: 0;cursor: pointer;">'
                        + '</div>'
                        + '<div class="hides buy-1" data-group="' + groupslist[i]['id'] + '" style="margin-right: -143px;cursor: pointer;width: 112px;background-color: #A7D2A9;height: 47px;margin-left: 47px;border: 1px solid #8BC48D;text-align: center;line-height: 47px;">'
                        + '<span style="color:#FFF;font-size:13px">' + groupslist[i]['name'] + '</span>'
                        + '</div>'
                        + '</div>'
                        + '<img src=' + dqurl + '/static/demo/images/l04.png width="47" height="49" class="shows" style="float: right;border: 0;cursor: pointer;"/>'
                        + '</a>'
                        + '</li>'
                }
                $('.clive-ys').append(ab);
            }
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

            $(".buy-1").click(function(){
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
document.write(
    '<div id="service" style="width: 161px;height: 290px;position: fixed;top: 350px;right: 0px;z-index: 100;">'
    +'<ul style="list-style: none;margin: 0;padding: 0;" class="clive-ys">'
    +'</ul></div>');

