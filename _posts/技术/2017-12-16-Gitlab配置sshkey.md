---
layout: post
title: Gitlab配置SSHKey并连接服务器设置
category: 技术
tags: 
keywords: 
description: 
---

一、设置Git的username和email

	git config --global user.name "your_username"
	git config --global user.email "your_email"

二、生成ssh密钥

1、进入C:\Users\Administrator\\.ssh，查看是否生成过ssh密钥id_ras.pub，如果看到一长串以"ssh-rsa"或"ssh-dsa"开头的字符串，则可以跳过密钥的生成步骤。

2、生成密钥

	ssh-keygen -t rsa -C “$your_email”
	
最后得到了两个文件：id_rsa和id_rsa.pub

3、修改密钥的读写权限

	chmod 777 id_rsa id_rsa.pub

4、查看公钥 

	cat ~/.ssh/id_rsa.pub

拷贝粘贴完整的key到你的gitlab客户端

![1](/public/img/gitlab_1.png)

5、生成putty.ppk文件，供windows Git客户端使用

5.1 运行puttygen
5.2 点击Conversions菜单项中的import key
5.3 选择生成的id_rsa文件
5.4 在puttygen的界面上点击Save private key按钮就可以把撕咬转换成ppk格式的文件了
5.5 使用ppk文件，进入TortoiseGit的Settings选项，点击下图三个按钮，选中ppk文件后保存设置。

![2](/public/img/gitlab_2.png)




2018.01.03使用VPN的方式连接Gitlab

1、运维添加vpn账号

2、完成第一步后，登录如下地址注册vpn账号
	
	http://183.2.219.16:23323/

账号是 dev 密码是 r6ehxt0ijnb3efbe
申请用户名为名字全拼，所有信息都要填，邮箱写公司邮箱

3、完成第二步后，找运维要你名字全拼.ovpn文件

4、下载vpn 客户端软件
在http://openvpn.ustc.edu.cn/网址上找到对应的Win版本的客户端下载

64位系统:

	http://openvpn.ustc.edu.cn/openvpn-install-2.3.10-I601-x86_64.exe

32位系统:

	http://openvpn.ustc.edu.cn/openvpn-install-2.3.10-I601-i686.exe

5、安装与配置
安装TAP驱动的时候有个没有经过数字签名的警告,选择允许安装。
把运维提供过来的你名字全拼.ovpn文件拷贝到openvpn安装目录config下面,一般是C:\program files\openvpn\config，也可能是C:\Program Files (x86)\OpenVPN\config

6、启动客户端进行登录认证
在桌面双击客户端的图标，或者进入openvpn的安装目录bin下(默认是C:\program files\openvpn\bin)，找到openvpn-gui.exe, 在这个openvpn-gui.exe文件上单击鼠标右键,选择"以管理员身份运行"(英语是Run as Administrator)
如果openvpn-gui已经启动,但不是以管理员身份启动，请先退出再以管理员开启

7、绑定hosts，C:\Windows\System32\drivers\etc\hosts添加如下记录，保存。
192.168.100.112 gitlab.aipai.com


8、访问git 页面: http://gitlab.aipai.com:9090
