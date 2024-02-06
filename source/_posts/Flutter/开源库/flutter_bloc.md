---
title: flutter_bloc
toc: true
tags: Flutter
---


## 基本用法

核心概念：将UI和数据分离，数据使用Event、Bloc（Cubit）、State来进行单项流转。

![](./1.webp)

1. 通过BlocProvider提供Bloc供不同地方使用
2. 使用BlocBuilder监听Bloc的状态变化，根据状态变化来刷新UI
3. Bloc中处理业务逻辑
4. State中保存数据

## 常用API


### Bloc.observer

全局监听Event事件的变化、bloc的转化、异常回调


### BlocProvider、MultiBlocProvider

绑定bloc

### BlocBuilder

视图层监听bloc的状态变化，根据状态变化来刷新UI。buildWhen中判断是否需要刷新

```
BlocBuilder<BlocA, StateA>(
  builder: (context, state) {
    return Container();
  },
  buildWhen: (previous, current) {
    return previous != current;
  },
)
```

### BlocSelector

```dart
BlocSelector<BlocA, StateA, StateB>(
  selector: (state) {
    //判断是否需要刷新
    return state;
  },
  builder: (context, state) {
    return Container();
  },
)
```

### BlocListener

```dart
BlocListener<BlocA, StateA>(
  listener: (context, state) {
    // do stuff here based on BlocA's state
  },
  child: Container(),
)
```
```

### Bloc<Event,State>

Bloc、Cubit的基类，bloc中监听Event，处理业务逻辑，emit State


### Event

实体类，定义成事件类型，区分不同的业务场景

### State

实体类，存储数据，驱动UI刷新


## 注意事项

- emit的时候需要重新构造State对象，是否可以优化？
- 为了精细化处理，需要使用多个BlocBuilder，每个Builder都要实现自己的buildWhen，避免不必要的刷新
- 异步操作完后的emit之前需要判断下isClosed

## 参考

- [官方文档](https://bloclibrary.dev)
