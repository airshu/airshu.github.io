---
title: PC客户端技术方案分析
tags: PC
---


## 不同PC客户端技术方案的比较

### Qt

官网：[https://www.qt.io/](https://www.qt.io/)

Qt具有跨平台的特性，可选择QWidget、QQuick。整个包比较大。虽然可以根据实际情况去掉一部分动态库和文件，还是比较大。


### CEF（Chromium Embedded Framework）

官网：[https://bitbucket.org/chromiumembedded/cef/src/master/](https://bitbucket.org/chromiumembedded/cef/src/master/)

是一个基于Google Chromium 的开源项目。Google Chromium项目主要是为Google Chrome应用开发的，而CEF的目标则是为第三方应用提供可嵌入浏览器支持。CEF隔离底层Chromium和Blink的复杂代码，并提供一套产品级稳定的API，发布跟踪具体Chromium版本的分支，以及二进制包。
通过封装接口, 然后由chromium回调到自己的程序, 驱动整个程序运行。

个人认为选择CEF的主要原因有以下几点：

- 基于JS、Html这一套Web技术，开发速度快；
- 能做出高性能的动画效果


### Electron

官网：[http://www.electronjs.org/](http://www.electronjs.org/)


使用Node.js（作为后端）和Chromium（作为前端）完成桌面GUI应用程序的开发。Electron是在chromium的基础之上, 再嵌入一了个js执行的v8引擎, 由此v8引擎与chromium内部的v8进行信号的交互, 驱动程序运行。

### duilib

官网：[https://github.com/duilib/duilib](https://github.com/duilib/duilib)

开源，小巧灵活，容易扩展，界面与业务逻辑分离。国内有许多大厂都在用这个库，不过应该都进行过深入的定制，官方版本的更新并不频繁，文档跟其他几个比起来差距较大。

教程： [https://blog.oo87.com/cpp/6868.html](https://blog.oo87.com/cpp/6868.html)


### WPF（Windows Presentation Foundation）

微软推出的基于Windows Vista的用户界面框架，属于.NET Framework 3.0的一部分。基于Direct3D创建，使用GPU，拥有更好的性能。

### UMP（Universal Windows Platform）

官方介绍：[https://docs.microsoft.com/zh-cn/windows/uwp/get-started/universal-application-platform-guide](https://docs.microsoft.com/zh-cn/windows/uwp/get-started/universal-application-platform-guide)

在 Windows 10 中，微软首次引入了 UWP（通用 Windows 平台）的概念，让开发者只需一次编写，就能让程序在电脑和手机等多种设备上运行。

### PyQt

下载地址： [https://pypi.org/project/PyQt5/](https://pypi.org/project/PyQt5/)

基于Qt的Python封装，由于Python的简易特性，开发效率极高。



## 不同软件的技术实现方案：

- yy：Qt+CEF
- 钉钉：CEF+Qt5+duilib
- 斗鱼：Qt+声网SDK+CrashRpt
- 虎牙：.Net+Qt4
- 刀锋电竞：Electron
- 微信PC端：duilib
- 网易CC：Qt4+PyQt4+ActionScript(Flex)



## 参考

- [https://www.dazhuanlan.com/2019/09/29/5d8f936a633a2/?__cf_chl_jschl_tk__=ef7184070e28df4b7ee98496aa8b8ff50c47dcd7-1602323919-0-ASFIF35e3NpZNuU7Ndt3pR36r7hlqGch5EsER64Huxe0jFolt_H3NQYXXDmvjWl_m8WVlRnkeLLk1CpX-mLzObrx_mpJIWdumnG8N-g4L7RCf1XxZyM3Ucv6EPDJhAfJSexUlyeoz-AzeC4nE10bcWsW6MyJjhJRQfvo2ABHsoKcu0RLGe4_PIkvL8ox7CchII1vJKWNus0JBvjUiLa0TWyWOGE2WLCwUAwYSEIRE5vqTnW4bMP0C5MTZnjw6sk7Je9gHmAM79oqXilMJdJrVonFl3oItVG8fPn-iwqZbFdBK3iqj7xjlstE8HSgJ7ZEdQ](https://www.dazhuanlan.com/2019/09/29/5d8f936a633a2/?__cf_chl_jschl_tk__=ef7184070e28df4b7ee98496aa8b8ff50c47dcd7-1602323919-0-ASFIF35e3NpZNuU7Ndt3pR36r7hlqGch5EsER64Huxe0jFolt_H3NQYXXDmvjWl_m8WVlRnkeLLk1CpX-mLzObrx_mpJIWdumnG8N-g4L7RCf1XxZyM3Ucv6EPDJhAfJSexUlyeoz-AzeC4nE10bcWsW6MyJjhJRQfvo2ABHsoKcu0RLGe4_PIkvL8ox7CchII1vJKWNus0JBvjUiLa0TWyWOGE2WLCwUAwYSEIRE5vqTnW4bMP0C5MTZnjw6sk7Je9gHmAM79oqXilMJdJrVonFl3oItVG8fPn-iwqZbFdBK3iqj7xjlstE8HSgJ7ZEdQ)