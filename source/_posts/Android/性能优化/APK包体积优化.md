---
title: APK包体积优化
tags: Android
toc: true
---

### 删除无用资源

### 底层库优化

有时候，可能只使用了开源库中对某部分功能，可以对其源码进行删减重新打包。

### 图片压缩

放入项目之前，对图片进行压缩，比如使用tinypng

### 图片资源格式的选择

优先选择使用webp格式


### Gradle配置

    minifyEnabled true //删除无用代码
    shrinkResources true  //删除无用资源


### 动态加载资源

对于一些不是启动就要使用的资源，可以将其放到服务器，做成动态下载。


