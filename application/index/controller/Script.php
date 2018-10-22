<?php
namespace app\index\controller;

use think\Controller;
use think\Request;
use think\Session;

class Script extends Controller
{

    public function kefu()
    {
        // 客服的客户端用户id
        if(cookie('kf_uid')==null){
            session('kf_uid');
            cookie('kf_uid',session_id(),3600*24*7);
            $ucnt1 = db('customer')->count()+1;
            $ucnt=sprintf("%06d", $ucnt1);

            // 获得用户ip
            $user_ip = request()->ip(0,true);
            // 获得用户所在城市
            $user_city = $this->getCity($user_ip);
            cookie('kf_uname',$user_city.$ucnt,3600*24*7);
        }
        $key = input('get.key');
        // 空，或者元素选择器，# = %23
        $container = input('get.container');
        $icon_width = input('get.icon_width');
        $text_width = input('get.text_width');

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
            'uid' => cookie('kf_uid'),
            'uname' => cookie('kf_uname'),
        ]);

        return $this->fetch();
    }

    public function getCity($ip)
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

}
