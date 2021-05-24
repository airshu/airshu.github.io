---
layout: post
title: Java容器
category: Java
tags: Java
keywords:
description:
---

![](/public/img/java/collections_1.png)

容器类图

![](/public/img/java/collections_2.png)


Java 中常用的存储容器就是数组和容器，二者有以下区别：

- 存储大小是否固定
    - 数组的长度固定；
    - 容器的长度可变。
- 数据类型
    - 数组可以存储基本数据类型，也可以存储引用数据类型；
    - 容器只能存储引用数据类型，基本数据类型的变量要转换成对应的包装类才能放入容器类中。

Java 容器框架主要分为 Collection 和 Map 两种。其中，Collection 又分为 List、Set 以及 Queue。

- Collection - 一个独立元素的序列，这些元素都服从一条或者多条规则。
    - List - 必须按照插入的顺序保存元素。
    - Set - 不能有重复的元素。
    - Queue - 按照排队规则来确定对象产生的顺序（通常与它们被插入的顺序相同）。
- Map - 一组成对的“键值对”对象，允许你使用键来查找值。



## 基础接口

### Iterator、Iterable

Iterator：可迭代接口，迭代对象
Iterable：Collection 接口扩展了 Iterable 接口

```
public class IteratorDemo {

    public static void main(String[] args) {
        List<Integer> list = new ArrayList<>();
        list.add(1);
        list.add(2);
        list.add(3);
        Iterator it = list.iterator();
        while (it.hasNext()) {
            System.out.println(it.next());
        }
    }

}

```


### Comparable 和 Comparator

Comparable：排序接口。若一个类实现了 Comparable 接口，表示该类的实例可以比较，也就意味着支持排序。实现了 Comparable 接口的类的对象的列表或数组可以通过 Collections.sort 或 Arrays.sort 进行自动排序。

Comparator：比较接口。在 Java 容器中，一些可以排序的容器，如 TreeMap、TreeSet，都可以通过传入 Comparator，来定义内部元素的排序规则。

### Cloneable

Java 中 一个类要实现 clone 功能 必须实现 Cloneable 接口，否则在调用 clone() 时会报 CloneNotSupportedException 异常。
Java 中所有类都默认继承 java.lang.Object 类，在 java.lang.Object 类中有一个方法 clone()，这个方法将返回 Object 对象的一个拷贝。Object 类里的 clone() 方法仅仅用于浅拷贝（拷贝基本成员属性，对于引用类型仅返回指向改地址的引用）。
如果 Java 类需要深拷贝，需要覆写 clone() 方法。

### fail-fast机制

Java 容器的一种错误检测机制。例如：假设存在两个线程（线程 1、线程 2），线程 1 通过 Iterator 在遍历容器 A 中的元素，在某个时候线程 2 修改了容器 A 的结构（是结构上面的修改，而不是简单的修改容器元素的内容），那么这个时候程序就会抛出 ConcurrentModificationException 异常，从而产生 fail-fast 机制。


## List

### 特征

- 元素可重复

### 常用List

- ArrayList：数组实现，随机访问速度快，插入删除较慢
- LinkedList：链表实现，插入、删除较快，但查找需要遍历整个链表，速度较慢
- Vector：和 ArrayList 类似，但它是线程安全的

## Set

### 特征

- 元素不能重复

### 常用Set

- HashSet：基于哈希实现，支持快速查找，但不支持有序性操作，例如根据一个范围查找元素的操作。并且失去了元素的插入顺序信息，也就是说使用 Iterator 
  遍历 HashSet 得到的结果是不确定的。
- TreeSet：底层使用红黑树，支持有序性操作，但是查找效率不如 HashSet，HashSet 查找时间复杂度为 O(1)，TreeSet 则为 O(logn)；
- LinkedHashSet：具有 HashSet 的查找效率，且内部使用链表维护元素的插入顺序。

## Map

### 特征

- 使用键值对存储
- 键值对都可以为null

### 常用Map

- HashMap：在JDK1.8中，基于数组+链表+红黑树，
- HashTable：哈希表实现，本身是同步的，不支持null键和值
- LinkedHashMap：使用链表来维护元素的顺序，顺序为插入顺序或者最近最少使用（LRU）顺序。
- SortedMap：
- TreeMap：基于红黑树的一种提供顺序访问的Map


## Queue

- LinkedList：可以用它来支持双向队列；
- PriorityQueue 是基于堆结构实现，可以用它来实现优先级队列。



## 常见面试题

### ArrayList与LinkedList的实现和区别？

- ArrayList由动态数组实现，LinkedList由链表实现
- ArrayList随机访问快，LinkedList插入删除快

