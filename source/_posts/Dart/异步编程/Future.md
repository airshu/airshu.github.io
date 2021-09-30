---
title: Future
toc: true
tags: Flutter
---


Future 是在未来某个时间获得想要对象的一种手段。Future 表示一个不会立即完成的计算过程。与普通函数直接返回结果不同的是异步函数返回一个将会包含结果的 Future。该 Future 会在结果准备好时通知调用者。

Future中除了microtask外，其他任务都是添加到Event队列中执行。

Future状态


- 运行状态(pending)，表示任务还未完成，也没有返回值 
- 完成状态(completed)，表示任务已经结束（有结果或者异常）



## 创建Future


- Future()
- Future.microtask()
- Future.sync()
- Future.value()
- Future.delayed()
- Future.error()
- Future.foreach(Iterable elements, FutureOr action(T element))
- Future.any（futures）
- Future.doWhile()


## 处理异步操作的结果

- Future.then()

任务执行完成会进入这里，能够获得返回的执行结果。

- Future.catchError()

有任务执行失败，可以在这里捕获异常。

- Future.whenComplete()

当任务停止时，最后会执行这里。

## 参考

- [Flutter进阶篇（4）-- Flutter的Future异步详解](https://www.jianshu.com/p/c0e30769ea7e)
- [Flutter中的异步编程——Future ](https://juejin.cn/post/6882684933739905032)
