<?php
namespace app\index\controller;

use think\Controller;
use think\Request;
use think\Session;

class Script extends Controller
{

    public function kefu()
    {
        $this->initCustomerCookie();

        $key = input('get.key');
        // 空，或者元素选择器，# = %23
        $container = input('get.container');
        $icon_width = input('get.icon_width');
        $text_width = input('get.text_width');
        $icon = input('get.icon');

        if($icon==null||$icon==''){
            $icon="https://clive.pingbuwang.com/static/demo/images/l04.png";
        }

        $website=db('website')->where('website_key',$key)->find();
        if($website==null){
            return;
        }
        $groups = db('groups')->where('website_id',$website['id'])->select();
        $jgroups = json_encode($groups);

        $this->assign([
            'key'=>$key,
            'container' => $container,
            'icon_width' => $icon_width,
            'text_width' => $text_width,
            'jgroups' => $jgroups,
            'uid' => cookie('kf_customer_id'),
            'uname' => cookie('kf_customer_name'),
            'icon' => $icon,
        ]);

        return $this->fetch();
    }

    private function getCity($ip)
    {
        $ip2region = new \Ip2Region();
        $info = $ip2region->btreeSearch($ip);

        $city = explode('|', $info['region']);

        if(0 != $info['city_id']){
            return   $city['3'];
        }else{

            return  $city['0'];
        }
    }

    private function initCustomerCookie(){
        // 客服的客户端用户id
        if(cookie('kf_customer_id')==null||cookie('kf_customer_id')==''){
            session('kf_customer_id');
            cookie('kf_customer_id',session_id(),3600*24*7);
            $ucnt1 = db('customer')->count()+1;
            $ucnt=sprintf("%06d", $ucnt1);

            // 获得用户ip
            $user_ip = request()->ip(0,true);
            // 获得用户所在城市
            $user_city = $this->getCity($user_ip);
            cookie('kf_customer_name',$user_city.$ucnt,3600*24*7);
        }
    }

}
