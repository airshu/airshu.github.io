---
title: flutter_bloc
toc: true
tags: Flutter
---


## 基本用法

核心概念：将UI和数据分离，数据使用Event、Bloc（Cubit）、State来进行单项流转。

![](./1.webp)

## 常用API

## 注意事项

- emit的时候需要重新构造State对象，增加内存开销
- 为了精细化处理，需要使用多个BlocBuilder，每个Builder都要实现自己的buildWhen
- 异步操作完后的emit之前需要判断下isClosed

## 参考

- [官方文档](https://bloclibrary.dev)
