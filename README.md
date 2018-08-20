## clive
clive客服系统，是采用thinkphp5+Gatewayworker开的高性能客服系统  

***
## clive客服系统交流群
QQ: 12160952


***  
## 测试说明
测试地址：http://zl.dakanggou.com:8066/ <br>
管理后台：http://zl.dakanggou.com:8066/admin/ &nbsp;&nbsp;账号和密码都是  admin<br>
客服后台：http://zl.dakanggou.com:8066/service/ <br>
客服后台的账号和密码，在管理后台设置。  账号：客服2  密码：123456

***
## 2018-08-20需要优化的bug
* 基于SessionID来确定访客。同一个SessionID在客服端看到的是同有一个访客。
* 客服不在线的时候，客户可以直接离线留言，而不需要做成留言窗口。 
* 最好管理后台可以设置，客服不在线的时候采用哪种方式。系统设置 - 客服设置
* 访客发言后，回车或ctrl+回车，不管用。需要优化。
* 访客的名称默认用 省_市_编号。
* 访客可以在聊天窗口修改自己的昵称。
* 访客的数据存储在 LocalStorage 里面。 记录下来是哪个域名的。或者是ip_端口
