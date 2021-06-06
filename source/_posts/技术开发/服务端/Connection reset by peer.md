---
title: Connection reset by peer) while reading response header from upstream
tags: 服务端
toc: true
---


### 问题：Connection reset by peer) while reading response header from upstream

#### 描述：

某些请求一直返回**502 Bad Gateway**的错误，查看服务端的error日志，显示Connection reset by peer。当时的场景是一个每隔一分钟的定时脚本
每次运行时，获取需要处理的数据，同步请求某个服务端接口进行文件上传。猜测是这个接口请求响应很慢，一分钟后又再次请求同样的接口而出现问题。

#### 处理：

修改接口对应的逻辑，让这个接口能快速响应；此问题消失。查阅资料，Nginx的响应有几个参数设置：

- keepalive_timeout：设置客户端的长连接超时时间，如果超过这个时间客户端没有发起请求，则Nginx服务器会主动关闭长连接。
- keepalive_requests：设置与客户端的建立的一个长连接可以处理的最大请求次数，如果超过这个值，则Nginx会主动关闭该长连接。

对于此类问题，也可以尝试将keepalive_timeout的时间设置的长一些。

