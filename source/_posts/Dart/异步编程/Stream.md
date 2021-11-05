---
title: Stream
toc: true
tags: Dart
---

Stream 是一系列异步事件的序列。其类似于一个异步的 Iterable，不同的是当你向 Iterable 获取下一个事件时它会立即给你，但是 Stream 则不会立即给你而是在它准备好时告诉你。


**Stream的类型：**

- Single-Subscription

最常见的类型是一个 Stream 只包含了某个众多事件序列的一个。而这些事件需要按顺序提供并且不能丢失。当你读取一个文件或接收一个网页请求时就需要使用这种类型的 Stream。

这种 Stream 只能设置一次监听。重复设置则会丢失原来的事件，而导致你所监听到的剩余其它事件毫无意义。当你开始监听时，数据将以块的形式提供和获取。

- Broadcast

另一种流是针对单个消息的，这种流可以一次处理一个消息。例如可以将其用于浏览器的鼠标事件。

你可以在任何时候监听这种 Stream，且在此之后你可以获取到任何触发的事件。这种流可以在同一时间设置多个不同的监听器同时监听，同时你也可以在取消上一个订阅后再次对其发起监听。



Stream 也有同步流和异步流之分。它们的区别在于同步流会在执行 add，addError 或 close 方法时立即向流的监听器 StreamSubscription 发送事件，而异步流总是在事件队列中的代码执行完成后在发送事件。


**相关类：**

- Stream
- StreamController：流的控制器
- StreamSink：事件输入口
- StreamSubscription：用于管理事件的注册、暂停与取消等
- StreamTransformer
- MultiStreamController

## 创建Stream



## 处理Stream的方法

```dart
Future<T> get first;
Future<bool> get isEmpty;
Future<T> get last;
Future<int> get length;
Future<T> get single;
Future<bool> any(bool Function(T element) test);
Future<bool> contains(Object? needle);
Future<E> drain<E>([E? futureValue]);
Future<T> elementAt(int index);
Future<bool> every(bool Function(T element) test);
Future<T> firstWhere(bool Function(T element) test, {T Function()? orElse});
Future<S> fold<S>(S initialValue, S Function(S previous, T element) combine);
Future forEach(void Function(T element) action);
Future<String> join([String separator = '']);
Future<T> lastWhere(bool Function(T element) test, {T Function()? orElse});
Future pipe(StreamConsumer<T> streamConsumer);
Future<T> reduce(T Function(T previous, T element) combine);
Future<T> singleWhere(bool Function(T element) test, {T Function()? orElse});
Future<List<T>> toList();
Future<Set<T>> toSet();

```


## 修改Stream的方法


```dart

Stream<R> cast<R>();
Stream<S> expand<S>(Iterable<S> Function(T element) convert);
Stream<S> map<S>(S Function(T event) convert);
Stream<T> skip(int count);
Stream<T> skipWhile(bool Function(T element) test);
Stream<T> take(int count);
Stream<T> takeWhile(bool Function(T element) test);
Stream<T> where(bool Function(T event) test);

```


## StreamController

```

onListen 注册监听时回调
onPause 当流暂停时回调
onResume 当流恢复时回调
onCancel 当监听器被取消时回调
sync 当值为true时表示同步控制器SynchronousStreamController，默认值为false，表示异步控制器

factory StreamController(
      {void onListen(),
      void onPause(),
      void onResume(),
      onCancel(),
      bool sync: false})

```



## StreamTransformer

```dart
handleData：响应从流中发出的任何数据事件。提供的参数是来自发出事件的数据，以及EventSink<T>，表示正在进行此转换的当前流的实例
handleError：响应从流中发出的任何错误事件
handleDone：当流不再有数据要处理时调用。通常在流的close()方法被调用时回调
factory StreamTransformer.fromHandlers({
      void handleData(S data, EventSink<T> sink),
      void handleError(Object error, StackTrace stackTrace, EventSink<T> sink),
      void handleDone(EventSink<T> sink)
})

```

## 参考

- [Dart 语言异步编程之Stream](https://cloud.tencent.com/developer/article/1510821)
- [在 Dart 里使用 Stream](https://dart.cn/articles/libraries/creating-streams)
- [全面深入理解Stream](https://wizardforcel.gitbooks.io/gsyflutterbook/content/Flutter-11.html)
