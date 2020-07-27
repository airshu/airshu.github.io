---
layout: post
title: ReactiveX
category: 技术
tags: 技术
keywords: ReactiveX
description:
---

### Observables

#### 概述


ReactiveX是Reactive Extensions的缩写，一般简写为Rx，最初是LINQ的一个扩展，由微软的架构师Erik Meijer领导的团队开发，在2012年11月开源，Rx是一个编程模型，目标是提供一致的编程接口，帮助开发者更方便的处理异步数据流，Rx库支持大部分主流语
言。

使用这种方法的优点是，当你有一大堆的任务是不相互依赖，你就可以同时执行他们，而不是等待每一个类启动下一个前完成，这样你的整个任务包只需要花最长的任务时间。


在ReactiveX中，一个观察者(Observer)订阅一个可观察对象(Observable)。观察者对Observable发射的数据或数据序列作出响应。这种模式可以极大地简化并发操作，因为它创建了一个处于待命状态的观察者哨兵，在未来某个时刻响应Observable的通知，不需要阻塞等待Observable发射数据。


![](/public/files/rx_legend.png)

#### 背景知识

在很多软件编程任务中，或多或少你都会期望你写的代码能按照编写的顺序，一次一个的顺序执行和完成。但是在ReactiveX中，很多指令可能是并行执行的，之后他们的执行结果才会被观察者捕获，顺序是不确定的。为达到这个目的，你定义一种获取和变换数据的机制，而不是调用一个方法。在这种机制下，存在一个可观察对象(Observable)，观察者(Observer)订阅(Subscribe)它，当数据就绪时，之前定义的机制就会分发数据给一直处于等待状态的观察者哨兵。

这种方法的优点是，如果你有大量的任务要处理，它们互相之间没有依赖关系。你可以同时开始执行它们，不用等待一个完成再开始下一个（用这种方式，你的整个任务队列能耗费的最长时间，不会超过任务里最耗时的那个）。

有很多术语可用于描述这种异步编程和设计模式，在在本文里我们使用这些术语：一个观察者订阅一个可观察对象 (An observer subscribes to an Observable)。通过调用观察者的方法，Observable发射数据或通知给它的观察者。

在其它的文档和场景里，有时我们也将Observer叫做Subscriber、Watcher、Reactor。这个模型通常被称作Reactor模式。

#### 创建观察者

关于Observers的创建

**同步方式：**

1. 调用一个方法
2. 用一个变量存储方法返回值
3. 使用这个变量作为一个新的值做其他事情

例如：
```
//写一个回调
returnVal = someMethod(paramters);
//做新的事情
```

**异步方式：**

1. 定义一个方法，此方法是做一些事情并带有来之于异步调用的返回值；这个方法也是observer的一部分
2. 定义异步调用自身作为一个Observable
3. 通过订阅的方式连接observer到Observable
4. 执行你的业务

```
def myOnNext = {it->do something useful with it};
def myObservable = someOvservable(itsParamters);
myObservable.subscribe(myOnNext);
```

#### onNext，onCompleted，onError回调

- onNext：每当Observable广播数据时将会调用该方法，这个方法将会被作为Observable的一个广播项目参数被发送
- onError：表示内部已经发生异常
- onCompleted：成功调用onNext

```
def myOnNext     = { item -> /* 任务执行 */ };
def myError      = { throwable -> /* 失败时的响应 */ };
def myComplete   = { /* 成功后的响应 */ };
def myObservable = someMethod(itsParameters);
myObservable.subscribe(myOnNext, myError, myComplete);
// 继续执行相应的业务逻辑
```


#### 取消订阅（Ubsubscribing）

在一些ReactiveX实现中，有一个特殊的观察者接口Subscriber，它有一个unsubscribe方法。调用这个方法表示你不关心当前订阅的Observable了，因此Observable可以选择停止发射新的数据项（如果没有其它观察者订阅）。

取消订阅的结果会传递给这个Observable的操作符链，而且会导致这个链条上的每个环节都停止发射数据项。这些并不保证会立即发生，然而，对一个Observable来说，即使没有观察者了，它也可以在一个while循环中继续生成并尝试发射数据项。

#### 关于命名约定

ReactiveX的每种特定语言的实现都有自己的命名偏好，虽然不同的实现之间有很多共同点，但并不存在一个统一的命名标准。

而且，在某些场景中，一些名字有不同的隐含意义，或者在某些语言看来比较怪异。

例如，有一个onEvent命名模式(onNext, onCompleted, onError)，在一些场景中，这些名字可能意味着事件处理器已经注册。然而在ReactiveX里，他们是事件处理器的名字。


#### Observables的"热"和"冷"

Observable什么时候开始发射数据序列？这取决于Observable的实现，一个"热"的Observable可能一创建完就开始发射数据，因此所有后续订阅它的观察者可能从序列中间的某个位置开始接受数据（有一些数据错过了）。一个"冷"的Observable会一直等待，直到有观察者订阅它才开始发射数据，因此这个观察者可以确保会收到整个数据序列。

在一些ReactiveX实现里，还存在一种被称作Connectable的Observable，不管有没有观察者订阅它，这种Observable都不会开始发射数据，除非Connect方法被调用。

#### 用操作符组合Ovservable


**创建新的Observables的操作符：**

- Create
- Defer
- Empty/Never/Throw
- From
- Interval
- Just
- Range
- Repeat
- Start
- Timer

**转换被一个Observable发送的项目的操作付**

- Buffer
- FlatMap
- GroupBy
- Map
- Scan
- Window

**过滤被Observable发送的项目的操作符**

- Debounce
- Distinct
- ElementAt
- Filter
- First
- IgnoreElements
- Last
- Sample
- Skip
- SkipLast
- Take
- TakeLast

**将多个Observable合并成单个Observable的操作符**

- And/Then/When
- CombineLatest
- Join
- Merge
- StartWith
- Switch
- Zip

**错误处理操作符**

- Catch
- Retry

**实用工具操作符**

- Delay
- Do
- Materialize/Dematerialize
- ObserveOn
- Serialize
- Subscribe
- SubscribeOn
- TimeInterval
- Timeout
- Timestamp
- Using

**条件和布尔运算操作符**

- All
- Amb
- Contains
- DefaultIfEmpty
- SequenceEqual
- SkipUntil
- SkipWhile
- TakeUntil
- TakeWhile

**算术和集合操作符**

- Average
- Concat
- Count
- Max
- Min
- Reduce
- Sum

**转换操作符**

- To

**可连接Obervable的操作符**

- Connect
- Publish
- RefCount
- Replay



### Single

RxJava（以及它派生出来的RxGroovy和RxScala）中有一个名为Single的Observable变种。

Single类似于Observable，不同的是，它总是只发射一个值，或者一个错误通知，而不是发射一系列的值。

因此，不同于Observable需要三个方法onNext, onError, onCompleted，订阅Single只需要两个方法：

    onSuccess - Single发射单个的值到这个方法
    onError - 如果无法发射需要的值，Single发射一个Throwable对象到这个方法

Single只会调用这两个方法中的一个，而且只会调用一次，调用了任何一个方法之后，订阅关系终止。

#### Single操作符

操作符 |	返回值 |	说明
----|----|----
compose 	|Single 	|创建一个自定义的操作符
concat and concatWith |	Observable |	连接多个Single和Observable发射的数据
create |	Single 	|调用观察者的create方法创建一个Single
error |	Single |	返回一个立即给订阅者发射错误通知的Single
flatMap |	Single |	返回一个Single，它发射对原Single的数据执行flatMap操作后的结果
flatMapObservable |	Observable |	返回一个Observable，它发射对原Single的数据执行flatMap操作后的结果
from 	|Single |	将Future转换成Single
just |	Single |	返回一个发射一个指定值的Single
map 	|Single |	返回一个Single，它发射对原Single的数据执行map操作后的结果
merge |	Single |	将一个Single(它发射的数据是另一个Single，假设为B)转换成另一个Single(它发射来自另一个Single(B)的数据)
merge and mergeWith| 	Observable |	合并发射来自多个Single的数据
observeOn |	Single |	指示Single在指定的调度程序上调用订阅者的方法
onErrorReturn |	Single| 	将一个发射错误通知的Single转换成一个发射指定数据项的Single
subscribeOn |	Single| 	指示Single在指定的调度程序上执行操作
timeout |	Single| 	它给原有的Single添加超时控制，如果超时了就发射一个错误通知
toSingle |	Single |	将一个发射单个值的Observable转换为一个Single
zip and zipWith |	Single 	|将多个Single转换为一个，后者发射的数据是对前者应用一个函数后的结果

### Subject

Subject可以看成是一个桥梁或者代理，在某些ReactiveX实现中（如RxJava），它同时充当了Observer和Observable的角色。因为它是一个Observer，它可以订阅一个或多个Observable；又因为它是一个Observable，它可以转发它收到(Observe)的数据，也可以发射新的数据。

由于一个Subject订阅一个Observable，它可以触发这个Observable开始发射数据（如果那个Observable是"冷"的--就是说，它等待有订阅才开始发射数据）。因此有这样的效果，Subject可以把原来那个"冷"的Observable变成"热"的。

#### Subject种类


##### AsyncSubject
##### BehaviorSubject
##### PublishSubject
##### ReplaySubject

### Scheduler

如果你想给Observable操作符链添加多线程功能，你可以指定操作符（或者特定的Observable）在特定的调度器(Scheduler)上执行。

某些ReactiveX的Observable操作符有一些变体，它们可以接受一个Scheduler参数。这个参数指定操作符将它们的部分或全部任务放在一个特定的调度器上执行。

默认情况下，可观察对象和观察者的订阅方法是在同一个线程中运行的。使用ObserveOn和SubscribeOn操作符，你可以让Observable在一个特定的调度器上执行，ObserveOn指示一个Observable在一个特定的调度器上调用观察者的onNext, onError和onCompleted方法，SubscribeOn更进一步，它指示Observable将全部的处理过程（包括发射数据和通知）放在特定的调度器上执行。

![](/public/files/rx_schedulers.png)

#### RxJava示例

##### 调度器的种类

下表展示了RxJava中可用的调度器种类：

| 调度器类型                | 效果 |
| ------------------------- | ----------------------------------- |
| Schedulers.computation( ) | 用于计算任务，如事件循环或和回调处理，不要用于IO操作(IO操作请使用Schedulers.io())；默认线程数等于处理器的数量                                                                                               |
| Schedulers.from(executor) | 使用指定的Executor作为调度器                                                                                                                                                                                |
| Schedulers.immediate( )   | 在当前线程立即开始执行任务                                                                                                                                                                                  |
| Schedulers.io( )          | 用于IO密集型任务，如异步阻塞IO操作，这个调度器的线程池会根据需要增长；对于普通的计算任务，请使用Schedulers.computation()；Schedulers.io( )默认是一个CachedThreadScheduler，很像一个有线程缓存的新线程调度器 |
| Schedulers.newThread( )   | 为每个任务创建一个新线程                                                                                                                                                                                    |
| Schedulers.trampoline( )  | 当其它排队的任务完成后，在当前线程排队开始执行                                                                                                                                                              |

##### 默认调度器

在RxJava中，某些Observable操作符的变体允许你设置用于操作执行的调度器，其它的则不在任何特定的调度器上执行，或者在一个指定的默认调度器上执行。下面的表格个列出了一些操作符的默认调度器：

操作符 |	调度器
---- | ----
buffer(timespan)| 	computation
buffer(timespan, count) |	computation
buffer(timespan, timeshift) |	computation
debounce(timeout, unit) |	computation
delay(delay, unit) |	computation
delaySubscription(delay, unit) |	computation
interval 	|computation
repeat| 	trampoline
replay(time, unit) |	computation
replay(buffersize, time, unit)| 	computation
replay(selector, time, unit) |	computation
replay(selector, buffersize, time, unit) |	computation
retry |	trampoline
sample(period, unit) |	computation
skip(time, unit) |	computation
skipLast(time, unit) |	computation
take(time, unit) |	computation
takeLast(time, unit) |	computation
takeLast(count, time, unit) |	computation
takeLastBuffer(time, unit) |	computation
takeLastBuffer(count, time, unit) |	computation
throttleFirst |	computation
throttleLast |	computation
throttleWithTimeout |	computation
timeInterval |	immediate
timeout(timeoutSelector) |	immediate
timeout(firstTimeoutSelector, timeoutSelector) |	immediate
timeout(timeoutSelector, other) |	immediate
timeout(timeout, timeUnit) |	computation
timeout(firstTimeoutSelector, timeoutSelector, other) |	immediate
timeout(timeout, timeUnit, other) |	computation
timer |	computation
timestamp |	immediate
window(timespan) |	computation
window(timespan, count) |	computation
window(timespan, timeshift) |	computation


##### 使用调度器

除了将这些调度器传递给RxJava的Observable操作符，你也可以用它们调度你自己的任务。下面的示例展示了Scheduler.Worker的用法：

```Java
worker = Schedulers.newThread().createWorker();
worker.schedule(new Action0() {

    @Override
    public void call() {
        yourWork();
    }

});
// some time later...
worker.unsubscribe();
```

##### 递归调度器

要调度递归的方法调用，你可以使用schedule，然后再用schedule(this)，示例：


```Java
worker = Schedulers.newThread().createWorker();
worker.schedule(new Action0() {

    @Override
    public void call() {
        yourWork();
        // recurse until unsubscribed (schedule will do nothing if unsubscribed)
        worker.schedule(this);
    }

});
// some time later...
worker.unsubscribe();
```


##### 检查或设置取消订阅状态

Worker类的对象实现了Subscription接口，使用它的isUnsubscribed和unsubscribe方法，所以你可以在订阅取消时停止任务，或者从正在调度的任务内部取消订阅，示例：

```Java
Worker worker = Schedulers.newThread().createWorker();
Subscription mySubscription = worker.schedule(new Action0() {

    @Override
    public void call() {
        while(!worker.isUnsubscribed()) {
            status = yourWork();
            if(QUIT == status) { worker.unsubscribe(); }
        }
    }

});
```

##### 延时和周期调度器

你可以使用schedule(action,delayTime,timeUnit)在指定的调度器上延时执行你的任务，下面例子中的任务将在500毫秒之后开始执行：

```Java
someScheduler.schedule(someAction, 500, TimeUnit.MILLISECONDS);
```

使用另一个版本的schedule，schedulePeriodically(action,initialDelay,period,timeUnit)方法让你可以安排一个定期执行的任务，下面例子的任务将在500毫秒之后执行，然后每250毫秒执行一次：

```Java
someScheduler.schedulePeriodically(someAction, 500, 250, TimeUnit.MILLISECONDS);
```

##### 测试调度器

TestScheduler让你可以对调度器的时钟表现进行手动微调。这对依赖精确时间安排的任务的测试很有用处。这个调度器有三个额外的方法：

- advanceTimeTo(time,unit) 向前波动调度器的时钟到一个指定的时间点
- advanceTimeBy(time,unit) 将调度器的时钟向前拨动一个指定的时间段
- triggerActions( ) 开始执行任何计划中的但是未启动的任务，如果它们的计划时间等于或者早于调度器时钟的当前时间







### Operators

#### Introduction
#### Chaining Operators
#### The Operators of ReactiveX
#### Operators By Category



**背压**


                                                                                                                                                         |

- [reactivex.io](reactivex.io)
- [https://github.com/ReactiveX](https://github.com/ReactiveX)
- [https://mcxiaoke.gitbooks.io/rxdocs/content/topics/Getting-Started.html](https://mcxiaoke.gitbooks.io/rxdocs/content/topics/Getting-Started.html)