<?php
namespace app\index\controller;

use think\Controller;
use think\Request;
use think\Session;

class Index extends Controller
{

    public function index()
    {
        return $this->fetch();
    }

    // pc客户端
    public function chat()
    {
        $this->initCustomerCookie();
        // 跳转到移动端
        if(request()->isMobile()){
            $param = http_build_query([
                'id' => cookie('kf_customer_id'),
                'name' => cookie('kf_customer_name'),
                'group' => input('param.group'),
                'avatar' => input('param.avatar')
            ]);
            $this->redirect('/index/index/mobile?' . $param);
        }
        $leave_status=db('kf_config')->where('id',1)->value('leave_status');
        $this->assign([
            'leave_status'=>$leave_status,
            'socket' => config('socket'),
            'id' => cookie('kf_customer_id'),
            'name' => cookie('kf_customer_name'),
            'group' => input('param.group'),
            'avatar' => input('param.avatar'),
            'uip' => request()->ip(0,true),
        ]);

        return $this->fetch();
    }

    // 移动客户端
    public function mobile()
    {
        $this->initCustomerCookie();

        $this->assign([
            'socket' => config('socket'),
            'id' => cookie('kf_customer_id'),
            'name' => cookie('kf_customer_name'),
            'group' => input('param.group'),
            'avatar' => input('param.avatar'),
            'uip' => request()->ip(0,true),
        ]);

        return $this->fetch();
    }

    // 留言
    public function leaveMsg()
    {
        if(request()->isAjax()){

            $param = input('post.');
            if(empty($param['username']) || empty($param['phone']) || empty($param['content'])){
                return json(['code' => -1, 'data' => '', 'msg' => '请全部填写']);
            }

            $param['add_time'] = time();

            try{
                db('leave_msg')->insert($param);
            }catch (\Exception $e){
                return json(['code' => -2, 'data' => '', 'msg' => '留言失败']);
            }

            return json(['code' => 1, 'data' => '', 'msg' => '留言成功']);
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

}
