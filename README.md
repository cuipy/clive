## clive
clive客服系统，是采用thinkphp5+Gatewayworker开的高性能客服系统  

## clive 使用说明：
* 在页面引入以下代码
<script src='https://cdn.staticfile.org/jquery/2.1.4/jquery.min.js'></script>
<script src="//clive.pingbuwang.com/index/script/kefu?key=***&container=***&icon_width=***&v=1.02"></script>

* 引入字段说明：
> key: 每个网站都有一个唯一的key，由clive客服管理员提供

> container：如果右侧边栏加载，则不需要该字段；
>> 如果需要在某标签内显示客服图标，则container设置为容器标签的选择器，
>> 如：<div id="abc"></div>  则 选择器为 #abc，需要做url编码处理，设置 container=%23abc
>> %23 是 # 的 urlEncode的值
>> 如果container不为空，默认不显示文字。

> icon_with: 图标的宽度

> text_width: 文字的宽度
 

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
2 进入 /clive/vendor/GatewayWorker 文件夹，执行 php start.php start
3 后台运行  php start.php start -d  


## 优化程序说明
* 2018-9-4 优化客服发消息的时候，同一个用户的所有聊天窗口都会收到消息。应该只与对应的客服的窗口收到消息。    
在clive-cli.js中，socket对象上增加了 kf_id 变量；    
继续优化clive-mobile相关的问题；    
继续优化客服端潜在的问题 -- 客服端似乎不存在这个问题；    
修改后，需要将chat.html文件中的clive-cli.js的引用加上 ?v=n 以确保js不会缓存     






***  
## 测试说明
测试地址：http://clive.test.dakanggou.com/
管理后台：http://clive.test.dakanggou.com/admin/ &nbsp;&nbsp;账号和密码都是  admin
客服后台：http://clive.test.dakanggou.com/service/
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


## 2018-08-31优化
* 实现简单JS将客服窗口嵌入页面的功能
* 客服列表不能是固定的两个组，需要动态从服务器加载
* 客服后台可以设置显示分组还是显示具体的客服人员
* 显示客服人员的话，如果是没在线，则为灰度显示

## 2018-08-31 平台化改动
* 平台化：支持多网站客服，可以为多个网站开通客服
* 平台分为三部分：运营端、Service端、客户脚本端
* 运营端：运营人员使用的后台，入口为 /admin/
* Service端：网站客服端，入口为 /service/，网站在这里可以进行客服管理和操作。
* 客户脚本端，不再赘述。
