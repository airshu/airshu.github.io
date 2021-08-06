---
title: RxJava
tags: Java
toc: true
---


## 概要

使用观察者模式、装饰器模式，类似Java的IO流。将不同的操作符一层层的封装，然后再进行一层层的解封。


基本概念

- Observable(可观察者，即被观察者)
- Observer (观察者)
- subscribe (订阅)
- 事件



线程设置

- Scheduler.immediate() 直接运行在当前线程，这是默认的scheduler
- Scheduler.newThread() 开一个新的线程，并在新的线程中执行操作
- Scheduler.io() io操作(读写文件、网络交互)所使用的scheduler，和newThead类似，区别是io内部维护了一个没有数量上限的线程池，使用io可以避免
  不必要的线程创建 
- Scheduler.computation() 计算所用的scheduler，计算指的是cpu密集型计算，如图形的计算，使用固定数量(cpu核心数)的线程池
- Scheduler.mainThread() 在android主线程中运行


## BackpressureStrategy

当异步情况下, 被观察者发送数据过快, 而消费者无法及时处理数据, 导致缓存内存增大, 最终导致OOM, 背压就是为了处理这种情况。

策略 | 效果
--- | ---
MISSING | 无任何背压策略执行, 除非调用onBackpressureXXX
ERROR | 抛出异常
BUFFER | 内部维护可扩容的缓存池, 效果与Observer一样, 可能导致OOM
DROP | 如果下流无法跟上上流发射速度, 则会丢弃这块数据
LATEST | 当下流无法跟上上流的发射速度的时候, 则只保存最近生产的数据



## 参考

- [RxJava源码解析(三)-背压](https://yutiantina.github.io/2019/03/05/RxJava%E6%BA%90%E7%A0%81%E8%A7%A3%E6%9E%90(%E4%B8%89)-%E8%83%8C%E5%8E%8B/)
