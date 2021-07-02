---
title: HTTP协议
tags: linux
toc: true
---


## 包结构


### keep-alive

在 HTTP1.1 中是默认开启的。在 timeout 空闲时间内，连接不会关闭，相同重复的 request 将复用原先的 connection，减少握手的次数，大幅提高效率。
并非 keep-alive 的 timeout 设置时间越长，就越能提升性能。长久不关闭会造成 过多的僵尸连接和泄露连接出现。



## 缓存规则

