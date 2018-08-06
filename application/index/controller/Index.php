<?php
namespace app\index\controller;

use think\Controller;

class Index extends Controller
{
    public function index()
    {
        return $this->fetch();
    }

    // pc客户端
    public function chat()
    {
        // 跳转到移动端
        if(request()->isMobile()){
            $param = http_build_query([
                'id' => input('param.id'),
                'name' => input('param.name'),
                'group' => input('param.group'),
                'avatar' => input('param.avatar')
            ]);
            $this->redirect('/index/index/mobile?' . $param);
        }

        $this->assign([
            'socket' => config('socket'),
            'id' => input('param.id'),
            'name' => input('param.name'),
            'group' => input('param.group'),
            'avatar' => input('param.avatar'),
        ]);

        return $this->fetch();
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