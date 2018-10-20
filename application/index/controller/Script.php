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
        $show_model = input('get.show_model');
        $container_id = input('get.container_id');

        print <<<EOT
var dqurl="http://clive.pingbuwang.com";
var kefu_key="$key";
var kefu_show_model="$show_model";
var kefu_container_id="$container_id";

document.write('<script src='+dqurl+'/static/customer/js/layer/layer.js></script>');
document.write('<script src='+dqurl+'/static/customer/js/clive-tool.js></script>');
document.write('<script src='+dqurl+'/static/customer/js/clive-ys.js></script>');
EOT;

    }

}
