---
layout: post
title: Github Page添加gitment评论
category: 技术
tags: Jekyll
keywords:
description:
---


### 一、注册OAuth application

[https://github.com/settings/applications/new](https://github.com/settings/applications/new)

- Application name：随意填写一个名字
- Homepage URL：你博客的url
- Authorization callback URL：你博客的url

创建后会生成Client ID和Client Secret。


### 二、在博客对应文件中添加以下脚本

    <div id="container1"></div>
    <link rel="stylesheet" href="/public/css/default.css">
    <script src="/public/js/gitment.browser.js"></script>
    <script>
    var gitment = new Gitment({
      id: '页面 ID', // 可选。默认为 location.href
      owner: 'imsun', //https://github.com/imsun/gitment中owner为imsun，repo为gitment
      repo: 'gitment',
      oauth: {
        client_id: '注册上的Client ID',
        client_secret: '注册好的Client Secret',
      },
    })
    gitment.render('container1')
    </script>

将Github上对应的default.css和gitment.browser.js文件下载到自己的服务器上。

### 三、安装gh-oauth-server


> This service won't record or store anything. It only attaches a CORS header to that request and provides proxy. So that users can login in the frontend without any server-side implementation. 这里我们自己搭建一个转发服务

	git clone https://github.com/imsun/gh-oauth-server.git
	npm install
	nohup npm start &

### 四、修改gitment.browser.js文件

	...
	this.state.user.isLoggingIn = true;
	/*这里可以直接使用ip+port的方式，也可以使用Nginx配置一个代理*/
    _utils.http.post('http://149.28.94.229:3000', {
    	code: code,
        client_id: client_id,
        client_secret: client_secret
    	}, '').then(function (data) {
			_this.accessToken = data.access_token;
        	_this.update();
		}).catch(function (e) {
        	_this.state.user.isLoggingIn = false;
        	alert(e);
      	});
    	} else {
      		this.update();
    	}
	}
	...



### 参考：

- [https://github.com/imsun/gitment](https://github.com/imsun/gitment)
- [https://github.com/imsun/gh-oauth-server](https://github.com/imsun/gh-oauth-server)
- [https://blog.sometimesnaive.org/article/47.html](https://blog.sometimesnaive.org/article/47.html)
- [https://github.com/imsun/gitment/issues/170](https://github.com/imsun/gitment/issues/170)
- [https://frankjkl.github.io/2019/01/08/blogbuild-%E5%9C%A8Jekyll%E5%8D%9A%E5%AE%A2%E6%B7%BB%E5%8A%A0gitment%E8%AF%84%E8%AE%BA%E7%B3%BB%E7%BB%9F/](https://frankjkl.github.io/2019/01/08/blogbuild-%E5%9C%A8Jekyll%E5%8D%9A%E5%AE%A2%E6%B7%BB%E5%8A%A0gitment%E8%AF%84%E8%AE%BA%E7%B3%BB%E7%BB%9F/)






