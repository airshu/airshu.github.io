---
title: async
toc: true
tags: Flutter
---


## FutureBuilder

```dart
FutureBuilder({
  this.future, //通常是一个异步耗时任务
  this.initialData,//初始数据
  required this.builder,//Widget构造器，该builder会在Future执行的不同阶段被调用多次
})

final AsyncWidgetBuilder<T> builder;

//snapshot包含当前异步任务的状态信息及结果
typedef AsyncWidgetBuilder<T> = Widget Function(BuildContext context, AsyncSnapshot<T> snapshot);

```

### 实例

```dart


Widget build(BuildContext context) {
  return Center(
    child: FutureBuilder<String>(
      future: mockNetworkData(),
      builder: (BuildContext context, AsyncSnapshot snapshot) {
        // 请求已结束
        if (snapshot.connectionState == ConnectionState.done) {
          if (snapshot.hasError) {
            // 请求失败，显示错误
            return Text("Error: ${snapshot.error}");
          } else {
            // 请求成功，显示数据
            return Text("Contents: ${snapshot.data}");
          }
        } else {
          // 请求未结束，显示loading
          return CircularProgressIndicator();
        }
      },
    ),
  );
}

enum ConnectionState {
  /// 当前没有异步任务，比如[FutureBuilder]的[future]为null时
  none,

  /// 异步任务处于等待状态
  waiting,

  /// Stream处于激活状态（流上已经有数据传递了），对于FutureBuilder没有该状态。
  active,

  /// 异步任务已经终止.
  done,
}


```


## StreamBuilder

Dart中，Stream也是用于异步事件数据，和Future不同的是，它可以接收多个异步操作的结果。

StreamBuilder正式用于配合Stream来展示流上事件（数据）变化的UI组件。


```dart
StreamBuilder({
  this.initialData,
  Stream<T> stream,
  required this.builder,
}) 
```





## 参考

- [](https://wizardforcel.gitbooks.io/gsyflutterbook/content/Flutter-11.html)
- [如何使用 FutureBuilder and StreamBuilder 优雅的构建高质量项目](https://juejin.cn/post/6844904202414587917)
- [https://book.flutterchina.club/chapter7/futurebuilder_and_streambuilder.html](https://book.flutterchina.club/chapter7/futurebuilder_and_streambuilder.html)