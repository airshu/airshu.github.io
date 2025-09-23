---
title: Android的消息机制
tags: Android
toc: true
---

## 基本概念

- Handler：消息处理器，负责发送和处理Message对象
- Looper：消息循环器，负责轮询消息队列，并将消息分发给对应的Handler进行处理
- MessageQueue：消息队列，存储待处理的Message对象
- Message：消息对象，包含了要处理的信息和数据