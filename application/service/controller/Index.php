<?php
namespace app\service\controller;
use think\Session;
class Index extends Base
{
    public function index()
    {
        // 客服信息
        $userInfo = db('users')->where('id', cookie('l_user_id'))->find();
        Session::set('kefu_userid',$userInfo['id']);
        $this->assign([
            'uinfo' => $userInfo,
            'word' => db('words')->select(),
            'groups' => db('groups')->where('status', 1)->where('website_id',$userInfo['website_id'])->select(),
            'status' => db('kf_config')->where('id', 1)->find()
        ]);
		if(request()->isMobile()){
			return $this->fetch('mobile');
        }
		
        return $this->fetch();
    }

    // 获取服务用户列表
    // 此方法是为了防止客服工作期间错误的刷新工作台，导致服务人员消失的问题
    public function getUserList()
    {
        if(request()->isAjax()){

            // 此处只查询过去 三个小时 内的未服务完的用户
            $userList = db('service_log')->field('user_id id,user_name name,user_avatar avatar,user_ip ip')
                ->where('kf_id', cookie('l_user_id'))
                ->where('start_time', '>', time() - 3600 * 3)->where('end_time', 0)->select();

            return json(['code' => 1, 'data' => $userList, 'msg' => 'ok']);
        }
    }

    // 获取聊天记录
    public function getChatLog()
    {
        if(request()->isAjax()){

            $param = input('param.');

            $limit = 10; // 一次显示10 条聊天记录
            $offset = ($param['page'] - 1) * $limit;

            $logs = db('chat_log')->where(function($query) use($param){
                $query->where('from_id', $param['uid'])->where('to_id', 'KF' . cookie('l_user_id'));
            })->whereOr(function($query) use($param){
                $query->where('from_id', 'KF' . cookie('l_user_id'))->where('to_id', $param['uid']);
            })->limit($offset, $limit)->order('id', 'desc')->select();

            $total =  db('chat_log')->where(function($query) use($param){
                $query->where('from_id', $param['uid'])->where('to_id', 'KF' . cookie('l_user_id'));
            })->whereOr(function($query) use($param){
                $query->where('from_id', 'KF' . cookie('l_user_id'))->where('to_id', $param['uid']);
            })->count();

            foreach($logs as $key=>$vo){

                $logs[$key]['type'] = 'user';
                $logs[$key]['time_line'] = date('Y-m-d H:i:s', $vo['time_line']);

                if($vo['from_id'] == 'KF' . cookie('l_user_id')){
                    $logs[$key]['type'] = 'mine';
                }
            }

            return json(['code' => 1, 'data' => $logs, 'msg' => intval($param['page']), 'total' => ceil($total / $limit)]);
        }
    }
    public function history(){
        $kefu_userid=Session::get('kefu_userid');
        $user_list=db('service_log')->where('kf_id',$kefu_userid)->order('start_time','desc')->column('user_id,user_name,user_ip,start_time');
        $this->assign('user_list',$user_list);
        return $this->fetch();
    }

    /**
     * @return \think\response\Json
     * 根据时间范围搜索
     */
    public function ajax_search_customer()
    {
        //获取时间
        $time = input('post.service_time');
        $customer_name = input('post.customer_name');

        //获得开始时间和结束时间
        $start_time=substr($time,0,10);
        $end_time=substr($time,-10).' 23:59:59';
        //转化成时间戳
        $start_time1=strtotime($start_time);
        $end_time1=strtotime($end_time);
        //传数据
        $kefu_userid=Session::get('kefu_userid');
        $user_list=db('service_log')->where('kf_id',$kefu_userid);
        if($time!=null&&$time!=''){
            $user_list = $user_list->where('start_time','>=',$start_time1)->where('start_time','<=',$end_time1);
        }
        if($customer_name!=null&&$customer_name!=''){
            $user_list = $user_list->whereLike('user_name','%'.$customer_name.'%');
        }
        $user_list = $user_list->order('start_time','desc') ->column('user_id,user_name,user_ip,start_time');
        $user_list=array_values($user_list);
        return json(['code' => 1, 'data' => $user_list, 'msg' => 'ok,endTime:'.$start_time1]);
    }
    // ip 定位
    public function gettime()
    {
        $start_time = input('param.start_time');
        $start_time =date('Y-m-d H:i:s', $start_time);
        if($start_time){
            return json(['code' => 1, 'data' => $start_time, 'msg' => 'ok']);
        }
    }
    public function getCity()
    {
        $ip = input('param.ip');

        $ip2region = new \Ip2Region();
        $info = $ip2region->btreeSearch($ip);

        $city = explode('|', $info['region']);

        if(0 != $info['city_id']){
            return json(['code' => 1, 'data' => $city['2'] . $city['3'] . $city['4'], 'msg' => 'ok']);
        }else{

            return json(['code' => 1, 'data' => $city['0'], 'msg' => 'ok']);
        }
    }
}
