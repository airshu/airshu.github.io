---
title: Framework概要
tags: Android
toc: true
---

## 概述

启动时init进程加载init.rc文件，启动zegote进程，zegote就是app_process进程，app_process进程装在Android的系统Class、
装载需要的底层so库，装载相应资源；app_process启动system_server进程，
system_server进程中创建了AMS、PMS、WMS。app_process与system_server进程通过socket通讯。

### **ActivityManagerService**

管理Activity，在App进程启动时，通过Binder，在ActivityThread中进行Activity的管理。

- 统一调度所有应用程序的Activity的生命周期
- 启动或杀死应用程序的进程
- 启动并调度Service的生命周期
- 注册BroadcastReceiver，并接收和分发Broadcast
- 启动并发布ContentProvider
- 调度task
- 处理应用程序的Crash
- 查询系统当前运行状态


### **PackageManagerService**

包管理，为了能在运行时快速的打开对应App，启动时会遍历整个app文件夹，解析Android Manifest.xml文件，将
相应信息存储起来。

### **WindowManagerService**

控制所有Window的显示与隐藏以及要显示的位置

- 为所有窗口分配Surface。客户端向WMS添加一个窗口的过程，其实就是WMS为其分配一块Suiface的过程，一块块Surface在WMS的管理下有序的排布在屏幕上。Window的本质就是Surface。
- 管理Surface的显示顺序、尺寸、位置
- 管理窗口动画
- 输入系统相关：WMS是派发系统按键和触摸消息的最佳人选，当接收到一个触摸事件，它需要寻找一个最合适的窗口来处理消息，而WMS是窗口的管理者，系统中所有的窗口状态和信息都在其掌握之中，完成这一工作不在话下。


### **Activity**

负责生命周期和事件处理

### **Window**

控制视图


-

## 流程图