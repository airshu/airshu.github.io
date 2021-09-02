---
title: tinker
tags: Android
toc: true
---

## 概述

测试是无法测出所有bug的，线上出问题在所难免，如果没有热更新方案。那么每次都需要重新更新！tinker是经过腾讯实践后公布的开源解决方案。由于patch包需要分发，
如果自己做后台也是开源，但bugly提供了相关解决方案。那么我们直接使用就行了。这里记录自己的整个接入流程，后续再分析其原理。

## 接入流程

![](./tinker.png)

大致流程：

1. 编译基准包；
2. 基于基准包，修复bug，编译patch文件；
3. 上传patch文件。


由于自己是直接接入bugly的集成方案，建议大家在接入前好好看看他们的文档。

- [Bugly Android热更新使用指南](https://bugly.qq.com/docs/user-guide/instruction-manual-android-hotfix/?v=1.0.0)
- [Bugly Android热更新详解](https://bugly.qq.com/docs/user-guide/instruction-manual-android-hotfix-demo/?v=1.0.0)
- [Bugly Android 热更新常见问题](https://bugly.qq.com/docs/user-guide/faq-android-hotfix/?v=1.0.0)
- [热更新API接口](https://bugly.qq.com/docs/user-guide/api-hotfix/?v=1.0.0)
- [tinker官方wiki](https://github.com/BuglyDevTeam/Bugly-Android-Demo/wiki)


**注意事项**

- 原有的Application逻辑，应该全部移到ApplicationLike中；
- 上传的包改一下名字，apk为扩展名可能会被运营商拦截；
- 注意打包命令，buildTinkerPatchArmeabiRelease，根据gradle的配置不同，有时候需要指定cpu架构，有时候不需要指定。主要看bakApk目录的层次；
- 基准包需要先启动，才可以上传patch文件；
- 可以不用指定基本版本，tinker自动获取versionCode、versionName

## 原理

## 参考

- [https://github.com/Tencent/tinker](https://github.com/Tencent/tinker)
- [Tinker - 微信开源的 Android 热修复框架](https://www.bookstack.cn/read/tinker/5117b3e26a238f0c.md)
