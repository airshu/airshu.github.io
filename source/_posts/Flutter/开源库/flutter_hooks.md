---
title: flutter_hooks
toc: true
tags: Flutter
---


## 什么是Hook？

Hooks 是来自 React 的一个概念，flutter_hooks 只是 React 实现到 Flutter 的一个端口。

[https://zh-hans.legacy.reactjs.org/docs/hooks-intro.html](https://zh-hans.legacy.reactjs.org/docs/hooks-intro.html)


## flutter_hooks

[https://github.com/rrousselGit/flutter_hooks/blob/master/packages/flutter_hooks/resources/translations/zh_cn/README.md](https://github.com/rrousselGit/flutter_hooks/blob/master/packages/flutter_hooks/resources/translations/zh_cn/README.md)

React Hooks 的 Flutter 实现。

其触发UI刷新使用的是setState，可能存在性能问题。

## 常用hooks


### useEffect


> 你之前可能已经在 React 组件中执行过数据获取、订阅或者手动修改过 DOM。我们统一把这些操作称为“副作用”，或者简称为“作用”。

相当于 initState + didUpdateWidget + dispose。用于在组件挂载、更新、卸载时执行副作用。副作用可能是访问网络、访问本地存储、订阅事件等等。

```dart

import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:http/http.dart' as http;

class NetworkRequest extends HookWidget {
  @override
  Widget build(BuildContext context) {
    final response = useState('');

    useEffect(() {
      http.get('https://jsonplaceholder.typicode.com/todos/1').then((res) {
        response.value = res.body;
      });
      return () {
        // 在组件卸载时取消订阅
      };
    }, []);

    return Scaffold(
      appBar: AppBar(
        title: Text('Network Request'),
      ),
      body: Center(
        child: Text(response.value),
      ),
    );
  }
}


```

在上面的例子中，我们使用 useEffect Hook 订阅了一个网络事件。useEffect 接收两个参数，第一个参数是副作用函数，第二个参数是依赖数组。当依赖数组中的某个值发生变化时，useEffect 将重新执行副作用函数。如果依赖数组为空，useEffect 将只在组件挂载和卸载时执行副作用函数。


### useStream

useStream 接收一个 Stream 对象作为参数，并返回一个包含 Stream 数据的变量。

```dart
import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';

class StreamDemo extends HookWidget {
  @override
  Widget build(BuildContext context) {
    final stream = Stream.periodic(Duration(seconds: 1), (i) => i).take(10);
    final data = useStream(stream);

    return Scaffold(
      appBar: AppBar(
        title: Text('Stream Demo'),
      ),
      body: Center(
        child: Text(data.toString()),
      ),
    );
  }
}

```

### useMemoized

用于缓存计算结果，避免重复计算。在生命周期中只会被调用一次

```dart
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';

class MemoizedDemo extends HookWidget {
  @override
  Widget build(BuildContext context) {
    final data = useMemoized(() => expensiveCalculation());

    return Scaffold(
      appBar: AppBar(
        title: Text('Memoized Demo'),
      ),
      body: Center(
        child: Text(data.toString()),
      ),
    );
  }

  int expensiveCalculation() {
    return 1 + 2 + 3 + 4 + 5;
  }
}


```



## 参考

- [Making Sense of React Hooks](https://medium.com/@dan_abramov/making-sense-of-react-hooks-fdbde8803889)
- [Flutter Hooks 使用及原理](https://juejin.cn/post/6854573214732025870)
- [掌握 Flutter 中的 Hooks🪝](https://tehub.com/a/c0VpgkJsuX)
- [https://github.com/rrousselGit/flutter_hooks/blob/master/packages/flutter_hooks/resources/translations/zh_cn/README.md](https://github.com/rrousselGit/flutter_hooks/blob/master/packages/flutter_hooks/resources/translations/zh_cn/README.md)