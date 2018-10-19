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

        print <<<EOT
var dqurl="http://clive.pingbuwang.com";
var kefu_key="$key";
document.write('<script src='+dqurl+'/static/customer/js/layer/layer.js></script>');
document.write('<script src='+dqurl+'/static/customer/js/clive-tool.js></script>');
document.write('<script src='+dqurl+'/static/customer/js/clive-ys.js></script>');
EOT;

    }

}
