---
title: KOOM
tags: Android
toc: true
---



[KOOM](https://github.com/KwaiAppTeam/KOOM) ：OOM分析工具


## 流程

初始化后，10秒后启动一个线程，每5秒轮询检测。当满足条件（比如内存不够用），启动一个新的进程，进行内存泄漏分析、裁剪、保存分析信息。
内存泄漏的判断是通过读取shark获取的heapGraph，判断Activity、Fragment、Bitmap等是否存在泄漏。

KOOMEnableChecker有一些限制条件，不满足条件的则不能进行监控。



## shark

shark-graph：square的开源库。文档地址：[https://square.github.io/leakcanary/api/shark/shark/](https://square.github.io/leakcanary/api/shark/shark/)

## xhook

xhook：爱奇艺的开源库，用于hook动态库。文档地址：[https://github.com/iqiyi/xHook/blob/master/docs/overview/android_plt_hook_overview.zh-CN.md](https://github.com/iqiyi/xHook/blob/master/docs/overview/android_plt_hook_overview.zh-CN.md)




## Get到的知识点


### Handler的用法

Handler执行一个Runnable方法，可以直接使用以下的方式来执行类方法

```java
koomHandler.post(this::manualTriggerInternal);
```


### ResultReceiver

使用ResultReceiver进行进程间通信，这个类也挺简单的，实现序列化接口。构造函数接受一个Handler。没有序列化的情况下使用Handler通信，序列化后
使用Binder通信。send发送消息，onReceiveResult接收消息。


## 参考

- [https://github.com/KwaiAppTeam/KOOM](https://github.com/KwaiAppTeam/KOOM)
- [https://www.gushiciku.cn/pl/p3Rl](https://www.gushiciku.cn/pl/p3Rl)
- [https://square.github.io/leakcanary/api/shark/shark/](https://square.github.io/leakcanary/api/shark/shark/)
- [https://github.com/iqiyi/xHook](https://github.com/iqiyi/xHook)
