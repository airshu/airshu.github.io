---
title: Java锁
date: 2021-05-29
tags: Java
toc: true
---

## 说明

CountDownLatch是在java1.5被引入，使一个线程等待其他线程各自执行完毕后再执行。


CountDownLatch是通过`共享锁`实现的。在创建CountDownLatch中时，会传递一个int类型参数count，该参数是“锁计数器”的初始状态。
当某线程调用该CountDownLatch对象的await()方法时，该线程会等待“共享锁”可用时，
才能获取共享锁进而继续运行。而“共享锁”可用的条件，就是`锁计数器`的值为0！而锁计数器的初始值为count，
每当一个线程调用该CountDownLatch对象的countDown()方法时，锁计数器减1；直到锁计数器为0时，前面的等待线程才能继续运行！



## 使用场景

- 让多个线程等待：比如模拟多线程并发
- 让单个线程等待：等待其他线程都处理完后，再执行某个操作

## 实现原理


## 参考

- [https://www.cnblogs.com/skywang12345/p/3533887.html](https://www.cnblogs.com/skywang12345/p/3533887.html)
- [https://zhuanlan.zhihu.com/p/148231820](https://zhuanlan.zhihu.com/p/148231820)
