---
title: 《深入理解Android卷1》读书笔记
tags: [读书笔记, Android]
toc: true
---

## 概要

《深入理解Android卷1》这本书在刚出来的时候就已经买了，当时应该也是看过的，但忘得很快，里面很多的源码分析，
且多数是native层的，虽然作者也会在分析完一段时间后就做一个总结。最近又把他拿出来看了看，这次看的时候，已经
对Android体系有一个认识了，所以理解起来还算好。但对于native层的点，光看这一本书是远远不够的。

还是将一些自己觉得重要的点都记录下来吧！

个人觉得本书的阅读顺序应该是：

1. 第一章了解Android系统的架构
2. 熟悉JNI，了解Java跟native通讯的机制
3. 第三、四章，了解Android启动流程
4. 第五章了解线程通信机制Handler
5. 六、七章以源码的角度来熟悉Binder机制，这里我觉得一定要扩展阅读，光看这些很难深入理解Binder
6. 理解Surface系统，阅读这章最好能先熟悉四大组件的启动流程，UI绘制流程，事件传递机制
7. 剩下的两章算扩展吧


## 第一章

介绍了整个Android体系，从底层的硬件设备到上面的应用层。

![](/wiki/Android/Android系统架构/android-stack_2x系统架构.png)

具体的可以参考[Android系统架构](/wiki/Android/Android系统架构/)


## 第二章

JNI是Java Native Interface的缩写，通过JNI可以做到：

1. Java程序中的函数可以调用Native语言写的函数
2. Native程序中的函数可以调用Java层的函数

我们在Java中调用C、C++代码的一般做法是使用System.loadLibrary("xxx.so")，然后声明native方法，即可使用。
在Android中，JNI函数有两种注册方式：

1. 静态方法
   
    1. 编写java文件，编译生成.class文件
    2. 使用javah命令，比如javah -o ouput packagename.classname，会生成一个output.h的头文件，里面会有对应的JNI层函数

2. 动态注册

由于是不同语言之间的调用，每种语言的基本类型有所差异，所以JNI会进行类型转换。

JNI提供三种类型的引用：

- Local Reference：本地引用。一旦JNI层函数返回，这些jobject就可能被垃圾回收
- Global Reference：全局引用，不主动释放，就不会被回收
- Weak Global Reference： 弱全局引用


## 第三章、第四章

![](./android_init.png)

大致流程：
1. 开机，初始化zygote（app_process）进程
2. 创建虚拟机
3. 注册JNI函数
4. 注册zygote用的socket，用于跟system_server进程通信
5. 预加载资源（比如加载Android相关的java类、so库）
6. 启动system_server进程
7. 初始化ams、wms、pms等等


## 第五章

RefBase、sp、wp实现了一套通过引用计数的方法控制对象生命周期的机制。这一块看得有点懵，因为C、C++中是没有
垃圾回收机制的，需要自己手动释放对象。这几个东西应该是为了方便对象释放而设计出来的吧？

介绍了一些同步类，这块如果对Java的锁机制有了解的话，看起来很轻松。

- Mutex：互斥锁
- AutoLock：Mutex的封装
- Condition：条件锁

接下来讲Looper和Handler，可以参考[Handler原理](/wiki/Android/基础/Handler原理/)

## 第八章

个人觉得这章很重要，可以让你了解整个绘制的流程和内部实现机制。





