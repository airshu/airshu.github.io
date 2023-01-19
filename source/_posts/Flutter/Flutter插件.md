---
title: Flutter插件
toc: true
tags: Flutter
---

Flutter只是一个UI框架，运行在宿主平台上，Flutter本身无法提供一些系统能力，比如蓝牙、相机、GPS等。插件是一种特殊的包，和纯dart包的主要区别是插件中除了dart代码，还包括特定平台的代码。

## 插件实现原理

Flutter提供了平台通道（platform channel）用于Flutter和原生平台的通信，通信本质上是一个远程调用（RPC），通过消息传递实现：

- 应用的Flutter部分通过平台通道将调用消息发送到宿主
- 宿主监听平台通道，并接收改消息。然后调用平台API，并将响应发送回Flutter