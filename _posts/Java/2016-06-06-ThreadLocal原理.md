---
layout: post
title: ThreadLocal原理
category: Java
tags: Java
keywords:
description:
---

ThreadLocal与普通变量的区别在于，每个使用该变量的线程都会初始化一个完全独立的实例副本。当线程结束时，它所使用的所有ThreadLocal相对的实例副本都可被回收。




- [http://www.jasongj.com/java/threadlocal/](http://www.jasongj.com/java/threadlocal/)
- [https://droidyue.com/blog/2016/03/13/learning-threadlocal-in-java/](https://droidyue.com/blog/2016/03/13/learning-threadlocal-in-java/)