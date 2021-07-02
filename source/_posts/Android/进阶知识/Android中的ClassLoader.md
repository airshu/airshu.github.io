---
title: Android中的ClassLoader
tags: Android
toc: true
---

## 概述

- BootClassLoader:主要用于加载系统的类，包括 java 和 android 系统的 类库，和 JVM 中不同，BootClassLoader 是 ClassLoader 内部类，
  是由 Java 实现的，它也是所有系统 ClassLoader 的父 ClassLoader
- PathClassLoader:用于加载 Android 系统类和开发编写应用的类，只能加载已经安装应用的 dex 或 apk 文件，也是 getSystemClassLoader 的返回对象
- DexClassLoader:可以用于加载任意路径的 zip,jar 或者 apk 文件，也是进行安卓动态加载的基础

## 继承关系

![](./1.png)


##
