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
        //把游客的id存放到session里面
        if(Session::has('visitor_id')){
            $visitor_id=session::get('visitor_id');
            $visitor_name=session::get('visitor_name');
        }else{
            $visitor_id=session_id();
            $visitor_name='会员'.substr($visitor_id, -3);
            Session::set('visitor_id',$visitor_id);
            Session::set('visitor_name',$visitor_name);
        }
        // 跳转到移动端
        if(request()->isMobile()){
            $param = http_build_query([
                'id' => $visitor_id,
                'name' => $visitor_name,
                'group' => input('param.group'),
                'avatar' => input('param.avatar')
            ]);
            $this->redirect('/index/index/mobile?' . $param);
        }
        $leave_status=db('kf_config')->where('id',1)->value('leave_status');
        $this->assign([
            'leave_status'=>$leave_status,
            'socket' => config('socket'),
            'id' => $visitor_id,
            'name' => $visitor_name,
            'group' => input('param.group'),
            'avatar' => input('param.avatar'),
        ]);

        return $this->fetch();
    }
    public function kfys_ajax()
    {
header("Access-Control-Allow-Origin:*");
header("Access-Control-Allow-Methods:POST, GET, OPTIONS, PUT, DELETE");
header('Access-Control-Allow-Headers:x-requested-with,content-type');

        if(request()->isAjax()) {
            $mst = input('post.mst');
            $key = input('post.key');

            $website = db('website') -> where('website_key',$key)->find();
            if($website==null){
                return  json(array('code' => -1, 'msg' => 'key不合法，无法获得有效的注册'));
            }

            if ($mst == 1) {
                $groups =db('groups');
                $groupslist = $groups->where(array('website_id'=> $website['id'],'status' => 1))->select();
            }
            return json(array('code' => 1, 'groupslist' => $groupslist));
        }
    }

    // 移动客户端
    public function mobile()
    {
        $this->assign([
            'socket' => config('socket'),
            'id' => input('param.id'),
            'name' => input('param.name'),
            'group' => input('param.group'),
            'avatar' => input('param.avatar'),
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
}
