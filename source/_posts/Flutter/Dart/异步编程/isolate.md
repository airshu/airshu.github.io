---
title: isolate
toc: true
tags: Dart
---


## 定义

isolate是Dart对actor并发模式的实现。运行中的Dart程序由一个或多个actor组成，这些actor也就是Dart概念里面的isolate。isolate是有自己的内存和单线程控制的运行实体。isolate本身的意思是“隔离”，因为isolate之间的内存在逻辑上是隔离的。isolate中的代码是按顺序执行的，任何Dart程序的并发都是运行多个isolate的结果。因为Dart没有共享内存的并发，没有竞争的可能性所以不需要锁，也就不用担心死锁的问题。

由于isolate之间没有共享内存，所以他们之间的通信唯一方式只能是通过Port进行，而且Dart中的消息传递总是异步的。

isolate跟线程类似，但线程之间可以共享内存，isolate不可以。

![](./isolate.png)




## 原理

- 初始化isolate数据结构
- 初始化堆内存(Heap)
- 进入新创建的isolate，使用跟isolate一对一的线程运行isolate
- 配置Port
- 配置消息处理机制(Message Handler)
- 配置Debugger，如果有必要的话
- 将isolate注册到全局监控器（Monitor）


```dart
isolate.cc




```

## 实例




## 参考

- [Dart 异步编程：隔离区和事件循环](https://medium.com/dartlang/dart-asynchronous-programming-isolates-and-event-loops-bffc3e296a6a)
- [聊一聊Flutter线程管理与Dart Isolate机制](https://zhuanlan.zhihu.com/p/40069285)

