---
title: ThreadPoolExecutor
tags: Java
toc: true
---

## 参数

```java
public ThreadPoolExecutor(int corePoolSize, int maximumPoolSize, long keepAliveTime, 
                          TimeUnit unit, BlockingQueue<Runnable> workQueue, 
                          ThreadFactory threadFactory, RejectedExecutionHandler handler);

```

- corePoolSize: 线程池核心线程的数量；
- maximumPoolSize: 线程池可创建的最大线程数量；
- keepAliveTime: 当线程数量超过了corePoolSize指定的线程数，并且空闲线程空闲的时间达到当前参数指定的时间时该线程就会被销毁，
  如果调用过allowCoreThreadTimeOut(boolean value)方法允许核心线程过期，那么该策略针对核心线程也是生效的；
    - allowCoreThreadTimeOut为true,则线程池数量最后销毁到0个。
    - allowCoreThreadTimeOut为false,超过核心线程数时，而且（超过最大值或者timeout），就会销毁。
- unit: 指定了keepAliveTime的单位，可以为毫秒，秒，分，小时等；
- workQueue: 存储未执行的任务的队列；
- threadFactory: 创建线程的工厂，如果未指定则使用默认的线程工厂；
- handler: 指定了当任务队列已满，并且没有可用线程执行任务时对新添加的任务的处理策略；




## 调度策略

当初始化一个线程池之后，池中是没有任何用户执行任务的活跃线程的，当新的任务到来时，根据配置的参数其主要的执行任务如下：

1. 若线程池中线程数小于corePoolSize指定的线程数时，每来一个任务，都会创建一个新的线程执行该任务，无论线程池中是否已有空闲的线程；
2. 若当前执行的任务达到了corePoolSize指定的线程数时，也即所有的核心线程都在执行任务时，此时来的新任务会保存在workQueue指定的任务队列中；
   - 当前核心线程都在执行任务，并且任务队列已满时，会创建新的线程执行任务，这里需要注意的是，创建新线程的时候当前总共需要执行的任务数是
     (corePoolSize + workQueueSize)，并不是只有corePoolSize个任务；
3. 当所有的核心线程都在执行任务，并且任务队列中存满了任务，此时若新来了任务，那么线程池将会创建新线程执行任务；
   - 这里workQueue主要有三种类型：ArrayBlockingQueue、LinkedBlockingQueue、SynchronousQueue，第一个是有界阻塞队列，第二个是无界阻塞队列，
     当然也可以为其指定界限大小，第三个是同步队列，对于ArrayBlockingQueue，其是需要指定队列大小的，当队列存满了任务线程池就会创建新的线程执行任务，
     对于LinkedBlockingQueue，如果其指定界限，那么和ArrayBlockingQueue区别不大，如果其不指定界限，那么其理论上是可以存储无限量的任务的，
     实际上能够存储Integer.MAX_VALUE个任务（还是相当于可以存储无限量的任务），此时由于LinkedBlockingQueue是永远无法存满任务的，
     因而maxPoolSize的设定将没有意义，一般其会设定为和corePoolSize相同的值，对于SynchronousQueue，其内部是没有任何结构存储任务的，
     当一个任务添加到该队列时，当前线程和后续添加任务的线程都会被阻塞，直至有一个线程从该队列中取出任务，当前线程才会被释放，因而如果线程池使用了该队列，
     那么一般corePoolSize都会设计得比较小，maxPoolSize会设计得比较大，因为该队列比较适合大量并且执行时间较短的任务的执行；
4. 若所有的线程（maximumPoolSize指定的线程数）都在执行任务，并且任务队列也存满了任务时，对于新添加的任务，其都会使用handler所指定的方式对其进行处理。
    - DiscardPolicy和DiscardOldestPolicy一般不会配合SynchronousQueue使用，因为当同步队列阻塞了任务时，该任务都会被抛弃；对于AbortPolicy，
      因为如果队列已满，那么其会抛出异常，因而使用时需要小心；对于CallerRunsPolicy，由于当有新的任务到达时会使用调用线程执行当前任务，
      因而使用时需要考虑其对服务器响应的影响，并且还需要注意的是，相对于其他几个策略，该策略不会抛弃任务到达的任务，因为如果到达的任务使队列
      满了而只能使用调用线程执行任务时，说明线程池设计得不够合理，如果任其发展，那么所有的调用线程都可能会被需要执行的任务所阻塞，导致服务器出现问题。
      


## 系统提供的线程池

### FixedThreadPool

```java
public static ExecutorService newFixedThreadPool(int nThreads) {
    return new ThreadPoolExecutor(nThreads, nThreads,
                                  0L, TimeUnit.MILLISECONDS,
                                  new LinkedBlockingQueue<Runnable>());
}

```

**特征**

- 这是一种线程数量固定的线程池，因为corePoolSize和maximunPoolSize都为用户设定的线程数量nThreads
- keepAliveTime为0，意味着一旦有多余的空闲线程，就会被立即停止掉，不过因为最多只有nThreads个线程，且corePoolSize和maximunPoolSize值一致，所以不会发生线程停掉的情况；
- 阻塞队列采用了LinkedBlockingQueue，它是一个无界队列，由于阻塞队列是一个无界队列，因此永远不可能拒绝任务

**弊端**

由于使用的是LinkedBlockingQueue无界队列，在资源有限的时候容易引起OOM异常

### CachedThreadPool

```java
public static ExecutorService newCachedThreadPool() {
    return new ThreadPoolExecutor(0, Integer.MAX_VALUE,
                                  60L, TimeUnit.SECONDS,
                                  new SynchronousQueue<Runnable>());
}
```

**特征**

- corePoolSize为0，maximumPoolSize为无限大，意味着线程数量可以无限大
- keepAliveTime为60S，意味着线程空闲时间超过60S就会被杀死
- 采用SynchronousQueue装等待的任务，这个阻塞队列没有存储空间，这意味着只要有请求到来，就必须要找到一条工作线程处理他，如果当前没有空闲的线程，那么就会再创建一条新的线程

**弊端**

当一个任务提交时，corePoolSize为0不创建核心线程，SynchronousQueue是一个不存储元素的队列，可以理解为队列永远是满的，因此最终会创建非核心线程来执行任务。

对于非核心线程空闲60s时将被回收。因为Integer.MAX_VALUE非常大，可以认为是可以无限创建线程的，在资源有限的情况下容易引起OOM异常


### SingleThreadExecutor

```java
public static ExecutorService newSingleThreadExecutor() {
    return new FinalizableDelegatedExecutorService
        (new ThreadPoolExecutor(1, 1,
                                0L, TimeUnit.MILLISECONDS,
                                new LinkedBlockingQueue<Runnable>()));
}

```

**特征**

- 只有一个线程，使用了无界队列LinkedBlockingQueue，某种意义上等同于newFixedThreadPool(1)

### ScheduledThreadPool

```java
public ScheduledThreadPoolExecutor(int corePoolSize) {
    super(corePoolSize, Integer.MAX_VALUE,
          DEFAULT_KEEPALIVE_MILLIS, MILLISECONDS,
          new DelayedWorkQueue());
}
```

**特征**

- ScheduledThreadPoolExecutor继承自ThreadPoolExecutor。能够延时调度任务或者周期性调度任务

## 参考

- [https://juejin.cn/post/6844903542965157901](https://juejin.cn/post/6844903542965157901)
- [https://blog.csdn.net/kusedexingfu/article/details/107374172](https://blog.csdn.net/kusedexingfu/article/details/107374172)
