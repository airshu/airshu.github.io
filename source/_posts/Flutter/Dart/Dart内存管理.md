---
title: Dart内存管理
toc: true
tags: Dart
---



## Dart运行环境（VM）

和Android Art一样，Flutter也对Dart源码做了AOT编译，直接将Dart源码编译成了本地字节码，没有了解释执行的过程，提升执行性能。这里重点关注Dart VM内存分配(Allocate)和回收(GC)相关的部分。

和Java显著不同的是Dart的"线程"(Isolate)是不共享内存的，各自的堆(Heap)和栈(Stack)都是隔离的，并且是各自独立GC的，彼此之间通过消息通道来通信。Dart天然不存在数据竞争和变量状态同步的问题，整个Flutter Framework Widget的渲染过程都运行在一个isolate中。

![](./20191227152028853.jpg)


Dart VM将内存管理分为新生代(New Generation)和老年代(Old Generation)。

- 新生代(New Generation): 通常初次分配的对象都位于新生代中，该区域主要是存放内存较小并且生命周期较短的对象，比如局部变量。新生代会频繁执行内存回收(GC)，回收采用“复制-清除”算法，将内存分为两块(图中的from 和 to)，运行时每次只使用其中的一块(图中的from)，另一块备用(图中的to)。当发生GC时，将当前使用的内存块中存活的对象拷贝到备用内存块中，然后清除当前使用内存块，最后，交换两块内存的角色。

![](./1.jpg)

- 老年代(Old Generation): 在新生代的GC中“幸存”下来的对象，它们会被转移到老年代中。老年代存放生命力周期较长，内存较大的对象。老年代通常比新生代要大很多。老年代的GC回收采用“标记-清除”算法，分成标记和清除两个阶段。在标记阶段会触发停顿(stop the world)，多线程并发的完成对垃圾对象的标记，降低标记阶段耗时。在清理阶段，由GC线程负责清理回收对象，和应用线程同时执行，不影响应用运行。

![](./2.jpg)


## 内存管理算法

GC(Garbage Collection)，垃圾回收机制，简单地说就是程序中及时处理废弃不用的内存对象的机制，防止内存中废弃对象堆积过多造成内存泄漏

常见的垃圾回收算法有引用计数法（Reference Counting）、标注并清理（Mark and Sweep GC）、拷贝（Copying GC）和逐代回收（Generational GC）等算法。

Flutter使用了原生对应的垃圾回收机制。

## 参考

- [Dart 内存管理机制](https://blog.csdn.net/rd_w_csdn/article/details/103732697)