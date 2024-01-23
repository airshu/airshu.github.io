---
title: flutter_redux
toc: true
tags: Flutter
---

使用 Redux 的好处是：

- 共享状态 
- 单一数据

Redux 主要由三个部分组成：

- Action 用于定义数据变化的行为
- Reducer 用于根据Action来产生新的状态，一般是一个方法
- Store 用于存储和管理state


![](./redux_1.png)

一般流程：

1. Widget 绑定了 Store 中的 state 数据。
2. Widget 通过 Action 发布一个动作。
3. Reducer 根据 Action 更新 state。
4. 更新 Store 中 state 绑定的 Widget。



## 参考

- [官网](https://pub.dev/packages/flutter_redux)
- [Redux、主题、国际化](https://wizardforcel.gitbooks.io/gsyflutterbook/content/Flutter-4.html)


---
title: flutter_redux
toc: true
tags: Flutter
---