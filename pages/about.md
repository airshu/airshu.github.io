---
layout: page
title: 关于

---



这是一个公司内部局域网静态网站，存放着相关的技术文档和周报、项目结点记录。

首先，根据你自己所属的岗位和部门看一看相关的tab中的文章，能快速的了解我们的开发流程和规范。

一些有用的工具地址：

**NAS管理后台** [http://192.168.1.61:5000/](http://192.168.1.61:5000/)

**源码管理：** [http://gitlab.aipai.com:9090](http://gitlab.aipai.com:9090)

**FTP服务器：**{{site.data.global.ip}}:21

- 用于存放个人考核表格

**Jenkins构建后台：**[http://{{site.data.global.ip}}:8889](http://{{site.data.global.ip}}:8889)

- 用于不同应用的自动构建

**共享文件夹地址：**\\\\{{site.data.global.ip}}\\\\share_directory

默认账号：aipai，密码：123456

Linux、Mac下访问需要安装samba服务：`sudo apt-get install samba`


文件夹内结构：

- Books：分享的电子书
- android：jenkins自动构建系统Android应用生成目录
- xiaodao：拍大师PC版自动构建系统生成目录
- lamian：神剪辑PC版自动构建系统生成目录
- baidu_paidashi：拍大师PC版百度定制版自动构建系统生成目录
- goplay_videoeditor：拍大师海外版自动构建系统生成目录
- steam_videoeditor：拍大师Steam版本自动构建系统生成目录
- UI设计文件夹：设计相关文件夹，存放所有版本的设计原始文件，切图等
- 工具软件：存放各种软件
- 产品相关：存放产品组相关的文档
- 测试文档：存放测试收集的相关问题整理



**Android开发工程师必看**

[http://gitlab.aipai.com:9090/andriod/AndroidDoc](http://gitlab.aipai.com:9090/andriod/AndroidDoc)

**iOS开发工程师必看**

[http://gitlab.aipai.com:9090/aipai_ios/document](http://gitlab.aipai.com:9090/aipai_ios/document)

**Web开发工程师必看**

[http://gitlab.aipai.com:9090/front/front-end](http://gitlab.aipai.com:9090/front/front-end)

**PHP开发工程师必看**

[http://gitlab.aipai.com:9090/AipaiDevelopers/AipaiServer/AipaiServerApiDoc](http://gitlab.aipai.com:9090/AipaiDevelopers/AipaiServer/AipaiServerApiDoc)

[http://gitlab.aipai.com:9090/AipaiDevelopers/AipaiDeveloperDoc](http://gitlab.aipai.com:9090/AipaiDevelopers/AipaiDeveloperDoc)



本站的源码存放在共享文件夹为\\\\{{site.data.global.ip}}\\\\doc_center，若有相关内容需要分享，请按照jekyll pages风格进行编写。


----

**如何编写Jekyll Page文章**

* 打开共享文件夹\\\\{{site.data.global.ip}}\\\\doc_center\\\\_posts
* 在相应的文件夹中复制一份template.md文件，命名规则为`年-月-日-标题.md`
* 用文本编辑器打开该文件，进行编写，编写规则为标准的markdown。

**注意：**
在\\\\{{site.data.global.ip}}\\\\doc_center\\\\_data文件夹中存放着一些yaml文件，想要在文档中使用这些全局变量的话，只需要按以下格式：

\{\{site.data.文件名字.key}}

