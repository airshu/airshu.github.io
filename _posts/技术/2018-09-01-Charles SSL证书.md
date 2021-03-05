---
layout: post
title: Windows下Charles支持HTTPS
category: 技术
tags: 技术
keywords:
description:
---


### Charles 设置

#### SSL设置

点击 `Proxy` -> `SSL Proxy Settings` -> `SSLProxy` -> `Add`

添加SSL代理规则

    Host:*
    Port:443

#### 证书配置

点击 `Help` -> `SSL Proxying` -> `Install Charles Root Certificate` -> `安装证书`

选择将所有的证书都放入`受信任的根证书颁发机构`

Mac需要在钥匙链中将证书设置为永久信任

#### 手机配置

连接跟电脑一样的网络，配置代理连接charles。浏览器访问`chls.pro/ssl`，下载安装证书


### 注意事项

Android7及以上无法抓取https，因为"Network Security Configuration"的新安全功能。这个功能运行开发人员在不修改应用程序的情况下
自定义他们的网络安全设置。如果应用程序运行的系统版本高于或等于24，并且targetSdkVersion>=24，则只有系统证书才被信任。


**参考**

- [https://www.charlesproxy.com/documentation/using-charles/ssl-certificates/](https://www.charlesproxy.com/documentation/using-charles/ssl-certificates/)
- [https://juejin.im/post/5b4f005ae51d45191c7e534a](https://juejin.im/post/5b4f005ae51d45191c7e534a)