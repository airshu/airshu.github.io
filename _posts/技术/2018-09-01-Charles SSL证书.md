---
layout: post
title: Windows下Charles支持HTTPS
category: 技术
tags: 技术 PyQt5
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

#### 手机配置

连接Charles代理，浏览器访问`chls.pro/ssl`，下载安装证书




**参考**

- [https://www.charlesproxy.com/documentation/using-charles/ssl-certificates/](https://www.charlesproxy.com/documentation/using-charles/ssl-certificates/)