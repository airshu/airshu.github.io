---
title: async and await
toc: true
tags: Flutter
---

- async用于声明方法是异步的
- await用于调用异步方法使用，表示等待异步方法执行完成后再执行后续的代码


async 和 await 关键字用于实现异步编程，并且让你的代码看起来就像是同步的一样。


必须在带有 async 关键字的 异步函数 中使用 await。

await 表达式的返回值通常是一个 Future 对象；如果不是的话也会自动将其包裹在一个 Future 对象里。 Future 对象代表一个`承诺`， await 表达式会阻塞直到需要的对象返回。


## 声明异步函数

`异步函数` 是函数体由 async 关键字标记的函数。

将关键字 async 添加到函数并让其返回一个 Future 对象。如果函数没有返回有效值，需要设置其返回类型为 Future<void>。

```dart

String lookUpVersion() => '1.0.0';

// 改成异步函数

Future<String> lookUpVersion() async => '1.0.0';
```
