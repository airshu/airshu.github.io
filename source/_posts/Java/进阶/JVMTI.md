---
title: JVMTI
toc: true
tags:
---

## 概要

JVM Tool Interface：JVMTI 本质上是在JVM内部的许多事件进行了埋点。通过这些埋点可以给外部提供当前上下文的一些信息。甚至可以接受外部的命令来改变下一步的动作。
外部程序一般利用C/C++实现一个JVMTIAgent，在Agent里面注册一些JVM事件的回调。当事件发生时JVMTI调用这些回调方法。
Agent可以在回调方法里面实现自己的逻辑。JVMTIAgent是以动态链接库的形式被虚拟机加载的。

主要的功能：

- 重新定义类。
- 跟踪对象分配和垃圾回收过程。
- 遵循对象的引用树，遍历堆中的所有对象。
- 检查 Java 调用堆栈。
- 暂停（和恢复）所有线程。


## 运用

在Android中，内存溢出分析、大图检测、ANR监控都可以通过此中方式实现。

## 参考

- [ART TI](https://source.android.com/devices/tech/dalvik/art-ti?hl=zh-cn)
- [Java黑科技之源：JVMTI完全解读](https://blog.csdn.net/duqi_2009/article/details/94518203)
- [基于JVMTI 实现性能监控](https://juejin.cn/post/6942782366993612813)
