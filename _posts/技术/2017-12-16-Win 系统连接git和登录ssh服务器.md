---
layout: post
title: Win 系统连接git和登录ssh服务器
category: 技术
tags: 
keywords: 
description: 
---

**一、创建密钥(可以使用已经创建过的密钥)，安装SecureCRT**

1、打开下图选项，点击下一步

![3](/public/img/gitlab_3.png)

![4](/public/img/gitlab_4.png)

2、点击RSA，点击下一步

![5](/public/img/gitlab_5.png)

3、 输入两次密码，出入账号名，如lyucheng，点击下一步

![6](/public/img/gitlab_6.png)

4、改为2048，点击下一步

![7](/public/img/gitlab_7.png)

5、点击下一步

![8](/public/img/gitlab_8.png)

6、选中OpenSSh Key format，可以自行选择文件保存路径，或者默认，点击完成。

![9](/public/img/gitlab_9.png)

7、自此，完成创建密钥过程，把公钥发给运维，私钥自己保存，用于登录认证。


**二、SecretCRT代理访问设置**

1、点击下图，建立会话

![10](/public/img/gitlab_10.png)

2、设置会话

![11](/public/img/gitlab_11.png)

3、设置SSH

![12](/public/img/gitlab_12.png)

4、选择私钥，点击OK

![13](/public/img/gitlab_13.png)

5、设置端口转发

![14](/public/img/gitlab_14.png)

6、添加代理信息，自此会话设置完成，点击OK

![15](/public/img/gitlab_15.png)


**三、连接服务**

例子1：访问内网www服务。

1、本地hosts添加指向，如指向www.aipai.com

![16](/public/img/gitlab_16.png)

2、测试访问，在secretCRT上打开刚才建立的会话，然后访问www.aipai.com

![17](/public/img/gitlab_17.png)

这样，实际上就访问到了192.168.1.77的机器了

例如2：访问git服务器

1、设置本地hosts

	127.0.0.1 gitlab.aipai.com

浏览器访问 http://gitlab.aipai.com:9090
git ssh域名写 gitlab.aipai.com:2224

注意：在这种用途，在上一步建立的tunel需要建立2个，一个是9090，一个是2224

2、在浏览器连接git页面和执行git ssh操作


**四、通过内网IP登录服务器**

`注：需要创建两套密钥，一套含密码，一套无密码，创建方式已经在第一点说明了。`

1、点击下图，建立tunel会话

![18](/public/img/gitlab_18.png)

2、设置会话，会话命名

![19](/public/img/gitlab_19.png)

3、设置ssh

![20](/public/img/gitlab_20.png)

4、选择包含密码的私钥，点击ok

![21](/public/img/gitlab_21.png)

5、设置端口转发

![22](/public/img/gitlab_22.png)

6、添加代理信息，自此会话设置完成，点击ok

![23](/public/img/gitlab_23.png)

7、开启转发，自此tunnel会话设置完成，点击OK

![24](/public/img/gitlab_24.png)

8、再次创建会话，点击下图，建立tunnel会话

![25](/public/img/gitlab_25.png)

9、设置会话，一般以服务器IP命名

![26](/public/img/gitlab_26.png)

10、设置SSH

![27](/public/img/gitlab_27.png)

11、选择免密码的私钥，点击ok

![28](/public/img/gitlab_28.png)

