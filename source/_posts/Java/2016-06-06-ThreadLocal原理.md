---
title: ThreadLocal原理
tags: Java
---

ThreadLocal与普通变量的区别在于，每个使用该变量的线程都会初始化一个完全独立的实例副本。当线程结束时，它所使用的所有ThreadLocal相对的实例副本都可被回收。


## 使用场景

- 每个线程需要有自己单独的实例
- 实例需要在多个方法中共享，但不希望被多线程共享

```
static final ThreadLocal<Looper> sThreadLocal = new ThreadLocal<Looper>();
private static void prepare(boolean quitAllowed) {
    if (sThreadLocal.get() != null) {
        throw new RuntimeException("Only one Looper may be created per thread");
    }
    sThreadLocal.set(new Looper(quitAllowed));
}
```

## 参考

- [http://www.jasongj.com/java/threadlocal/](http://www.jasongj.com/java/threadlocal/)
- [https://droidyue.com/blog/2016/03/13/learning-threadlocal-in-java/](https://droidyue.com/blog/2016/03/13/learning-threadlocal-in-java/)
