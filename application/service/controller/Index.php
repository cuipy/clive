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
            'groups' => db('groups')->where('status', 1)->select(),
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
        $user_list=db('service_log')->where('kf_id',$kefu_userid)->column('user_id,user_name');
        $this->assign('user_list',$user_list);
        return $this->fetch();
    }
    public function history1(){
        $kefu_userid=Session::get('kefu_userid');
        $chat_loglist=db('chat_log')->where('to_id','KF' . $kefu_userid)->column('from_id');
        $chat_loglist=array_unique($chat_loglist);
        foreach ($chat_loglist as $key=>$value){
            $logs[$key]['name']=db('service_log')->where('user_id',$value)->value('user_name');
            $logs[$key]['att'] = db('chat_log')->where(
                function($query)use($value, $kefu_userid){$query->where('from_id',$value)->where('to_id','KF' . $kefu_userid);
            })->whereOr(
                function ($query)use($value,$kefu_userid) {$query->where('to_id',$value)->where('from_id','KF' . $kefu_userid);})->order('id', 'desc')->select();
//            $total[$key] =  db('chat_log')->where(array('from_id'=>$value,'to_id'=>'KF' . $kefu_userid))->whereOr(array('from_id'=>'KF' . $kefu_userid,'to_id'=>$value))->count();
            foreach($logs[$key]['att'] as $ke=>$vo){
                $logs[$key]['att'][$ke]['type'] = 'user';
                $logs[$key]['att'][$ke]['time_line'] = date('Y-m-d H:i:s', $vo['time_line']);

                if($vo['from_id'] == 'KF' . $kefu_userid){
                    $logs[$key]['att'][$ke]['type'] = 'mine';
                }
            }
        }
        var_dump($logs);die;
        return $this->fetch();
    }
    // ip 定位
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
