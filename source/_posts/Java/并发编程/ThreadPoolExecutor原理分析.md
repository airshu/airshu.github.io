---
title: ThreadPoolExecutor原理分析
tags: Java
toc: true
---

## 线程池状态 

```java
private final AtomicInteger ctl = new AtomicInteger(ctlOf(RUNNING, 0));
// runState is stored in the high-order bits
private static final int RUNNING    = -1 << COUNT_BITS;
private static final int SHUTDOWN   =  0 << COUNT_BITS;
private static final int STOP       =  1 << COUNT_BITS;
private static final int TIDYING    =  2 << COUNT_BITS;
private static final int TERMINATED =  3 << COUNT_BITS;
```
当创建线程池后，初始时，线程池处于 RUNNING 状态;
如果调用了 shutdown()方法，则线程池处于 SHUTDOWN 状态，此时线程池不 能够接受新的任务，它会等待所有任务执行完毕;
如果调用了 shutdownNow()方法，则线程池处于 STOP 状态，此时线程池不能 接受新的任务，并且会去尝试终止正在执行的任务;
当线程池处于 SHUTDOWN 或 STOP 状态，并且所有工作线程已经销毁，任务缓 存队列已经清空或执行结束后，线程池被设置为 TERMINATED 状态。


## 任务的执行 

```java
private final BlockingQueue<Runnable> workQueue;//任务缓存队列，用来存放等待执行的任务
private final ReentrantLock mainLock = new ReentrantLock();//线程池的主要状态锁，对线程池状态(比如线程池大小、runState 等的改变都要使用这个锁)
private final HashSet<Worker> workers = new HashSet<>();//用来存放工作集
private volatile long keepAliveTime;//线程存货时间
private volatile boolean allowCoreThreadTimeOut;//是否允许为核心线程设置存活时间
private volatile int corePoolSize;//核心池的大小(即线程池中的线程数目大于这 个参数时，提交的任务会被放进任务缓存队列)
private volatile int maximumPoolSize;//线程池最大能容忍的线程数

public int getPoolSize(){}//获取当前线程池的线程数量
private volatile RejectedExecutionHandler handler;//任务拒绝策略
private volatile ThreadFactory threadFactory;//线程工厂，用来创建线程
private int largestPoolSize;//用来记录线程池中曾经出现过的最大线程数
private long completedTaskCount;//用来记录已经执行完毕的任务个数 

```

最核心的任务提交方法是 execute()方法，虽然通 过 submit 也可以提交任务，但是实际上 submit 方法里面最终调用的还是 execute()方法

```java
public void execute(Runnable command) {
    if (command == null)
        throw new NullPointerException();
    int c = ctl.get();
    if (workerCountOf(c) < corePoolSize) {
        if (addWorker(command, true))
            return;
        c = ctl.get();
    }
    if (isRunning(c) && workQueue.offer(command)) {
        int recheck = ctl.get();
        if (! isRunning(recheck) && remove(command))
            reject(command);
        else if (workerCountOf(recheck) == 0)
            addWorker(null, false);
    }
    else if (!addWorker(command, false))
        reject(command);
}
```

分三步：


1. If fewer than corePoolSize threads are running, try to
start a new thread with the given command as its first
task.  The call to addWorker atomically checks runState and
workerCount, and so prevents false alarms that would add
threads when it shouldn't, by returning false.

2. If a task can be successfully queued, then we still need
to double-check whether we should have added a thread
(because existing ones died since last checking) or that
the pool shut down since entry into this method. So we
recheck state and if necessary roll back the enqueuing if
stopped, or start a new thread if there are none.

3. If we cannot queue task, then we try to add a new
thread.  If it fails, we know we are shut down or saturated
and so reject the task.

## 线程池中的线程初始化 

addWorker中进行初始化，创建一个Worker，Worker内部从threadFactory中获取Thread。


在Thread的run方法中会调用getTask，来获取任务来执行。

```java
private Runnable getTask() {
    boolean timedOut = false; // Did the last poll() time out?

    for (;;) {
        int c = ctl.get();
        int rs = runStateOf(c);

        // Check if queue empty only if necessary.
        if (rs >= SHUTDOWN && (rs >= STOP || workQueue.isEmpty())) {
            decrementWorkerCount();
            return null;
        }

        int wc = workerCountOf(c);

        // Are workers subject to culling?
        boolean timed = allowCoreThreadTimeOut || wc > corePoolSize;

        if ((wc > maximumPoolSize || (timed && timedOut))
            && (wc > 1 || workQueue.isEmpty())) {
            if (compareAndDecrementWorkerCount(c))
                return null;
            continue;
        }

        try {
            Runnable r = timed ?
                workQueue.poll(keepAliveTime, TimeUnit.NANOSECONDS) :
                workQueue.take();
            if (r != null)
                return r;
            timedOut = true;
        } catch (InterruptedException retry) {
            timedOut = false;
        }
    }
}
```

## 任务缓存队列及排队策略

workQueue的类型为BlockingQueue<Runnable>，通常可以取下面三种类型:

1. ArrayBlockingQueue:基于数组的先进先出队列，此队列创建时必须指定大小;
2. LinkedBlockingQueue:基于链表的先进先出队列，如果创建时没有指定此 队列大小，则默认为 Integer.MAX_VALUE;
3. SynchronousQueue:这个队列比较特殊，它不会保存提交的任务，而是将直 接新建一个线程来执行新来的任务。


## 任务拒绝策略

当线程池的任务缓存队列已满并且线程池中的线程数目达到 maximumPoolSize，如果还有任务到来就会采取任务拒绝策略，通常有以下四种策略:

- ThreadPoolExecutor.AbortPolicy:丢弃任务并抛出 RejectedExecutionException 异常。 ThreadPoolExecutor.DiscardPolicy:也是丢弃任务，但是不抛出异常。
- ThreadPoolExecutor.DiscardOldestPolicy:丢弃队列最前面的任务，然后重新尝试执行任务(重复此过程)
- ThreadPoolExecutor.CallerRunsPolicy:由调用线程处理该任务

## 线程池的关闭

ThreadPoolExecutor 提供了两个方法，用于线程池的关闭，分别是 shutdown()和 shutdownNow()，其中：

- shutdown():不会立即终止线程池，而是要等所有任务缓存队列中的任务都执行完后才终止，但再也不会接受新的任务
- shutdownNow():立即终止线程池，并尝试打断正在执行的任务，并且清 空任务缓存队列，返回尚未执行的任务



## 线程池容量的动态调整

- setCorePoolSize:设置核心池大小 
- setMaximumPoolSize:设置线程池最大能创建的线程数目大小
