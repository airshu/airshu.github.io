---
title: RxJava
tags: Java
toc: true
---


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


## 参考

- []()
