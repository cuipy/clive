## clive
clive客服系统，是采用thinkphp5+Gatewayworker开的高性能客服系统  

***
## clive部署方式
QQ: 12160952     
* PHP要求：5.6+    

```text
CentOs 6.x
 rpm -Uvh http://mirror.webtatic.com/yum/el6/latest.rpm  

yum install php56w php56w-mysql php56w-gd php56w-mbstring 

```

* 安装httpd      
```text
yum install httpd
```


* clive基于ThinkPHP5。请在apache下指向到clive下的public路径

```xml
Listen 8066
NameVirtualHost *:8066
<VirtualHost *:8066>
ServerName localhost:8066
DocumentRoot "/work/php/clive/public"
  <Directory "/work/php/clive/public">
    Options Indexes FollowSymLinks
    AllowOverride All
    Order allow,deny
    Allow from all
  </Directory>
</VirtualHost>
```

* 新建db_clive数据库，语句见db_clive.sql文件
* 修改application下的database.php文件
```php
    // 服务器地址
    'hostname'        => '127.0.0.1',
    // 数据库名
    'database'        => 'db_clive',
    // 用户名
    'username'        => 'root',
    // 密码
    'password'        => 'root',
    // 端口
    'hostport'        => '3306',
```

* 搭建Gatewayworker运行环境    
1 php -m 查看已经安装的php的扩展，确认是否安装了pcntl和libevent。   
2 libevent扩展依赖于操作系统的libevent包，需要安装libevent包。
```text
yum install libevent2 libevent2-devel

wget http://pecl.php.net/get/libevent-0.1.0.tgz
tar xvf libevent-0.1.0.tgz

phpize

./configure --with-php-config=/usr/bin/php-config  --with-libevent
make && make install
```
3 pcntl和libevent都需要加入到php的扩展引用中， 注意，libevent必须在sockets.so之后    
4 php的扩展配置路径，linux可查看 /etc/php.d/ 文件夹    


* 启动Gatewayworker   
1 修改 /clive/vendor/GatewayWorker/Applications/whisper/Events.php的 43 行  
2 进入 /clive/vender/GatewayWorker 文件夹，执行 php start.php start   
3 后台运行  php start.php start -d  



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
