---
title: ThreadLocal原理
tags: Java
toc: true
---



ThreadLocal是一个线程内部的数据存储类，通过它可以在指定的线程中存储数据，数据存储以后，只有在指定线程中可以获取到存储的数据，
对于其他线程来说则无法获取到数据。



## 源码分析

Thread中有一个成员变量：

```java
ThreadLocal.ThreadLocalMap threadLocals = null;
```

ThreadLocal的set方法中，如果当前Thread的threadLocals有值，则设置，没有则创建一个新的ThreadLocalMap。

```java

/**
 * Sets the current thread's copy of this thread-local variable
 * to the specified value.  Most subclasses will have no need to
 * override this method, relying solely on the {@link #initialValue}
 * method to set the values of thread-locals.
 *
 * @param value the value to be stored in the current thread's copy of
 *        this thread-local.
 */
public void set(T value) {
    Thread t = Thread.currentThread();
    ThreadLocalMap map = getMap(t);
    if (map != null)
        map.set(this, value);
    else
        createMap(t, value);
}
```

ThreadLocal的get方法中，从当前线程的threadLocals拿map，如果有则返回，没有则初始化值。

```java

/**
 * Returns the value in the current thread's copy of this
 * thread-local variable.  If the variable has no value for the
 * current thread, it is first initialized to the value returned
 * by an invocation of the {@link #initialValue} method.
 *
 * @return the current thread's value of this thread-local
 */
public T get() {
    Thread t = Thread.currentThread();
    ThreadLocalMap map = getMap(t);
    if (map != null) {
        ThreadLocalMap.Entry e = map.getEntry(this);
        if (e != null) {
            @SuppressWarnings("unchecked")
            T result = (T)e.value;
            return result;
        }
    }
    return setInitialValue();
}
```

值的修改都是在自己线程中操作的，所以是线程安全的。

## 使用场景

- 每个线程需要有自己单独的实例
- 实例需要在多个方法中共享，但不希望被多线程共享
- Android中Hander

```java
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
