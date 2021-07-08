---
title: Android客户端经验谈
tags: Android
toc: true
---


## 一些技巧

- 异步线程应该在Activity、Fragment的生命周期结束时停止掉
- 减少不必要的线程切换





### 关于隐私策略

由于政策要求，隐私策略需要放到运行时就弹出并由用户确认。这里有个点需要注意，只有当用户确认后才可进行后续的数据请求。



## 参考

- [https://developer.android.com/training/articles/perf-tips?hl=zh-cn](https://developer.android.com/training/articles/perf-tips?hl=zh-cn)
