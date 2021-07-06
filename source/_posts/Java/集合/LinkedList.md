---
title: LinkedList
tags: Java
toc: true
---

## 概述

- LinkedList 是一个继承于AbstractSequentialList的`双向链表`。它也可以被当作堆栈、队列或双端队列进行操作。
- LinkedList 实现 List 接口，能对它进行队列操作。
- LinkedList 实现 Deque 接口，即能将LinkedList当作双端队列使用。
- LinkedList 实现了Cloneable接口，即覆盖了函数clone()，能克隆。
- LinkedList 实现java.io.Serializable接口，这意味着LinkedList支持序列化，能通过序列化去传输。
- LinkedList 是非同步的。


![](./linkedlist_1.png)


## 使用场景

- 需要通过循环迭代来访问列表中的某些元素。
- 需要频繁的在列表开头、中间、末尾等位置进行添加和删除元素操作。

## 参考

- [https://www.cnblogs.com/skywang12345/p/3308807.html](https://www.cnblogs.com/skywang12345/p/3308807.html)
