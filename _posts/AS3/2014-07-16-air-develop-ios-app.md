---
layout: post
title: "air develop ios app"
description: ""
category: AS3
tags: [air, ios]
---


记录使用AIR开发IOS应用中的点点滴滴

<br/>

#### 准备证书、供给配置文件
<br/>

首先，你得弄明白以下几个概念：

**证书签名请求文件**：包含用于生成开发证书的个人信息的文件。


**Certificates**：开发证书，用于标识以开发应用程序为目的的开发人员。由证书签名文件上传到apple站点后生成。


**p112证书文件**：用来构建iphone应用。用于windows平台。由从apple站点下载的cer文件转换成。



**供给配置文件(Provisioning)**：一个允许测试或分发iphone应用程序的文件。有几种类型

- 开发供给配置文件：用于开发和测试。满足条件的设备可以安装

- 分发供给配置文件：用于提交App Store。


**应用程序 ID**：标识由特定开发人员开发的 iPhone 应用程序（或多个应用程序）的唯一字符串。应在 iPhone 开发人员中心站点创建应用程序 ID。每个供给配置文件都具有一个关联的应用程序 ID 或应用程序 ID 模式。当开发应用程序时应使用此应用程序 ID（或模式）。应在 Flash Professional CS5 的“iPhone 设置” 对话框中或在应用程序描述符文件中使用应用程序 ID。

iPhone 开发人员中心的应用程序 ID 包含一个绑定种子 ID （后面带有绑定标识符）。绑定种子 ID 是 Apple 分配给应用程序ID 的一个字符串，例如 5RM86Z4DJM。绑定标识符包含一个您选择的反向域名字符串。绑定标识符可能以星号 (*) 结尾，表示通配符应用程序 ID。例如：

- 5RM86Z4DJM.com.example.helloWorld

- 96LPVWEASL.com.example.* （通配符应用程序 ID）

iPhone 开发人员中心提供了两种应用程序 ID：

• 通配符应用程序 ID — 在 iPhone 开发人员中心，这些应用程序 ID 以星号 (*) 结尾，例如96LPVWEASL.com.myDomain.* 或 96LPVWEASL.*。借助使用这种应用程序 ID 的供给配置文件，您可以生成测试应用程序，并且这些应用程序使用的应用程序 ID 与该模式匹配。对于应用程序的应用程序 ID，您可以将星号替换为任何有效字符字符串。例如，如果 iPhone 开发人员中心站点将 96LPVWEASL.com.example.* 指定为应用程序 ID，则您可以将 com.example.foo 或 com.example.bar 用作应用程序的应用程序 ID。

• 特定应用程序 ID — 它们定义在应用程序中使用的唯一应用程序 ID。在 iPhone 开发人员中心，这些应用程序 ID 不以星号结尾。例如：96LPVWEASL.com.myDomain.myApp。借助使用这种应用程序 ID 的供给配置文件，应用程序必须与该应用程序 ID 完全匹配。例如，如果 iPhone 开发人员中心站点将 96LPVWEASL.com.example.helloWorld 指定为应用程序 ID，您必须将 com.example.foo 用作应用程序的应用程序 ID。




**Devices**：可以安装应用程序的设备。  


     
**App IDs**：应用程序ID。创建供给配置文件后，该供给配置文件会绑定到应用程序ID。


<br/>

在开发之前，你必须做的事情：

**成为apple开发人员**


**生成证书请求文件**

1.Mac OS中，打开钥匙串访问。选择"首选项"-->"证书助手"-->"从证书颁发机构请求证书"。

2 填写相关资料，输入iPhone开发人员账户ID匹配的电子邮件地址。不要输入CA电子邮件地址。

3.保存此文件(CertificateSigningRequest.certSingingRequest)。

4.将此文件上传到https://developer.apple.com/account/ios/certificate/certificateList.action的证书列表中，审核通过后，下载对应的cer文件。如果是在windows下开发，还需要将其转换成p12文件。


**开发人员证书转换为p12文件**

1.打开钥匙串访问应用程序。

2.将下载下来的证书添加到钥匙串，选择"文件"-->"导入"。

3.选择密钥类别，选择与iPhone开发证书相关联的私钥，导出项目。




<br/>

#### 开发中遇到的问题

1.在iphone5或iphone中上下出现黑边。解决办法是在跟描述文件同目录下添加一个命名为Default-568@2x.png的空白图片，图片大小为1136*640。参考：

http://blogs.adobe.com/airodynamics/2012/11/07/deploying-air-apps-on-iphone-5/

http://zengrong.net/post/1752.htm/comment-page-1#comment-16642


2.不同的版本需要添加不同的Icon。不然在上传ipa文件时会有警告或直接报错。

ERROR ITMS-9000: "Missing required icon file. The bundle does not contain an app icon for iPhone / iPod touch of exactly '57x57' pixels, in .png fomat for iOS versions < 7.0."

这时候，你应该根据提示来添加不同尺寸的icon。



<br/>

#### 上传到AppStore

1.打开https://itunesconnect.apple.com，选择"Manage Your Applications"，点击"Add New App"，填写相关资料。需要注意的是Bundle ID属性，这个属性是可选择的，必须和你申请证书的appid保持一致。

2.通过Mac OS中的application uploader工具上传ipa文件。



<br/>

参考：

http://blog.csdn.net/akun1103/article/details/8632651

[air_deviphoneapps.pdf](http://help.adobe.com/zh_CN/air/build/air_buildingapps.pdf)
