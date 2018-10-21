<?php
namespace app\index\controller;

use think\Controller;
use think\Request;
use think\Session;

class Script extends Controller
{

    public function kefu()
    {
        if(session('kf_uid')==null){
            session('kf_uid',session_id());
            $ucnt1 = db('service_log')->count();
            $ucnt=sprintf("%06d", $ucnt1);

            // 获得用户ip
            $user_ip = request()->ip(0,true);
            // 获得用户所在城市
            $user_city = $this->getCity($user_ip);
            session('kf_uname',$user_city.$ucnt);
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
            'uid' => session('kf_uid'),
            'uname' => session('kf_uname'),
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
