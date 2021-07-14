---
title: Thread
toc: true
tags:
---


Java中的Thread的用法


## 同步队列与等待队列

- 同步队列：所有尝试获取该对象Monitor失败的线程，都加入同步队列排队获取锁。调用了start、notify方法后会进入该队列。

- 等待队列：已经拿到锁的线程在等待其他资源时，主动释放锁，置入该对象等待队列中，等待被唤醒，当调用notify会在等待队列中任意唤醒一个线程，
  将其置入同步队列的尾部，排队获取锁。调用wait方法时，会进入该队列。



## API

![](./1.png)

### join

主要作用是线程调度，等待该线程完成后，才能继续用下运行。一般用于等待异步线程执行完结果之后才能继续运行的场景。

```java
Thread t1 = new Thread(new Worker("thread-1")); 
t1.start();
t1.join();//要等待t1执行完后，当前线程才会继续往下执行
```

### yield

暂停当前正在执行的线程对象，不会释放资源锁，和sleep不同的是yield方法并不会让线程进入阻塞状态，而是让线程重回就绪状态，它只需要等待重新获取CPU执行时间，
所以执行yield()的线程有可能在进入到可执行状态后马上又被执行。

### notify

该方法用来通知那些可能等待该对象的对象锁的其他线程。

### wait和sleep区别

区别 | wait() | sleep()
--- | --- | ---
归属类|Object类实例方法|Thread类静态方法
是否释放锁|释放锁|不会释放锁
线程状态|等待|睡眠
使用时机|只能在同步块(Synchronized)中使用|在任何时候使用
唤醒条件|其他线程调用notify()或notifyAll()方法|超时或调用Interrupt()方法
cpu占用|不占用cpu，程序等待n秒|占用cpu，程序等待n秒


### interrupt

Thread类的sleep(),wait()等方法，在接收到interrupt()方法中断时，会抛出异常，同时会将中断标志置为false,如果确实需要中断该线程，则应该在捕捉到异常后，
继续调用interrupt()方法进行中断。

```java
//为什么不在异常时直接中断线程呢?主要是为了防止线程的资源没有得到释放而中断了线程
public class UserThread extends Thread {
    public void run() {
        while (!isInterrupt()) {
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                System.out.println(Thread.currentThread().getName + " Exception,interrupt flag is" + isInterrupted()); //释放资源
                doRelease();
                interrupt();
                e.printStackTrace();
            }
            System.out.println(Thread.currentThread().getName + " runing");
        }
        System.out.println(Thread.currentThread().getName + " interrupt flag is " + isInterrupted());
    }

    public static void main(String args) {
        UserThread thread = new UserThread();
        thread.start();
        Thread.sleep(30);
        thread.interrupt();
    }
}
```


## 参考

- [深入理解线程通信](https://crossoverjie.top/%2F2018%2F03%2F16%2Fjava-senior%2Fthread-communication%2F)
