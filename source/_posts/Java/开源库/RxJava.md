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



## 操作符

### create

```java
Observable.create(new ObservableOnSubscribe<String>() {
        @Override
        public void subscribe(ObservableEmitter<String> observableEmitter) throws Exception {
            observableEmitter.onNext("1");
            observableEmitter.onNext("2");
            observableEmitter.onNext("3");
            observableEmitter.onNext("4");
            observableEmitter.onError(new Throwable());
            observableEmitter.onComplete();//执行完complete之后就不能执行其他操作了

        }
    }).map(new Function<String, String>() {
        @Override
        public String apply(@NonNull String s) throws Exception {
            return s + "---";//进行转换
        }
    }).subscribe(new Observer<String>() {

        private Disposable mDisposable;

        @Override
        public void onSubscribe(Disposable disposable) {
            Log.d(TAG, "onSubscribe");
            mDisposable = disposable;
        }

        @Override
        public void onNext(String s) {
            Log.d(TAG, "onNext=" + s);
        }

        @Override
        public void onError(Throwable throwable) {
            Log.d(TAG, "onError");

        }

        @Override
        public void onComplete() {
            Log.d(TAG, "onComplete");

        }
    });
```

### map

一对一变换

```java

```

### flatmap

一对多、多对多变换

```java

```

### intervalRange

间隔触发

```java
/*
start：起始数值
count：发射数量
initialDelay：延迟执行时间
period：发射周期时间
unit：时间单位
scheduler：使用的线程策略
*/
public static Flowable<Long> intervalRange(long start, long count, long initialDelay, long period, TimeUnit unit, Scheduler scheduler)

public static Flowable<Long> intervalRange(long start, long count, long initialDelay, long period, TimeUnit unit)

// 从0-100，每个100毫秒刷新一次，刷新100次，在Android主线程
Flowable.intervalRange(1, 100, 0, 100, TimeUnit.MILLISECONDS, AndroidSchedulers.mainThread())
                .subscribe(aLong -> {
                    Log.d(TAG, "   =" + (100-aLong) + "   " +  Thread.currentThread().getName());
                });
```





## 参考

- [RxJava源码解析(三)-背压](https://yutiantina.github.io/2019/03/05/RxJava%E6%BA%90%E7%A0%81%E8%A7%A3%E6%9E%90(%E4%B8%89)-%E8%83%8C%E5%8E%8B/)
