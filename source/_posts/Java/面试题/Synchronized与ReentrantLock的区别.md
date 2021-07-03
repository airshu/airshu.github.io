---
title: Synchronized与ReentrantLock的区别
tags: Java
toc: true
---

## 底层原理区别

- 底层实现上来说，synchronized 是JVM层面的锁，是Java关键字，通过monitor对象来完成（monitorenter与monitorexit）， 
  对象只有在同步块或同步方法中才能调用wait/notify方法，
- ReentrantLock 是从jdk1.5以来（java.util.concurrent.locks.Lock）提供的API层面的锁。

- synchronized 的实现涉及到锁的升级，具体为无锁、偏向锁、自旋锁、向OS申请重量级锁，
- ReentrantLock实现则是通过利用CAS（CompareAndSwap）自旋机制保证线程操作的原子性和volatile保证数据可见性以实现锁的功能。

## 是否可手动释放

- synchronized 不需要用户去手动释放锁，synchronized 代码执行完后系统会自动让线程释放对锁的占用； 
- ReentrantLock则需要用户去手动释放锁，如果没有手动释放锁，就可能导致死锁现象。一般通过lock()和unlock()方法配合try/finally语句块来完成，
使用释放更加灵活。

## 是否可中断

- synchronized是不可中断类型的锁，除非加锁的代码中出现异常或正常执行完成；  
- ReentrantLock则可以中断，可通过trylock(long timeout,TimeUnit unit)设置超时方法或者将lockInterruptibly()放到代码块中，
调用interrupt方法进行中断。

##  是否公平锁

- synchronized为非公平锁 
- ReentrantLock则即可以选公平锁也可以选非公平锁，通过构造方法new ReentrantLock时传入boolean值进行选择，为空默认false非公平锁，true为公平锁。


## 锁是否可绑定条件Condition

- synchronized不能绑定；  
- ReentrantLock通过绑定Condition结合await()/singal()方法实现线程的精确唤醒，而不是像synchronized通过Object类
  的wait()/notify()/notifyAll()方法要么随机唤醒一个线程要么唤醒全部线程。
  
## 锁的对象

- synchronzied锁的是对象，锁是保存在对象头里面的，根据对象头数据来标识是否有线程获得锁/争抢锁；
- ReentrantLock锁的是线程，根据进入的线程和int类型的state标识锁的获得/争抢。