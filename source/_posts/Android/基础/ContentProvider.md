---
title: ContentProvider
tags: Android
toc: true
---




关于ContentProvider，用来提供其他地方（包括其他App）调用的一种全局（系统级）方式。有了ContentProvider，我们就能方便的调用相册的东西、
进行文件选择，在我们自己的App中，也可以提供一个数据中心。

在Jetpack中，也运用了ContentProvider的特性来提升启动速度。

## 一些注意点

> 对于面向 Android 7.0 的应用，Android 框架执行的 StrictMode API 政策禁止在您的应用外部公开 file:// URI。如果一项包含文件 URI 的 intent 离开您的应用，则应用出现故障，并出现 FileUriExposedException 异常。

因为Android7的变化，所以在使用FileProvider时需要做一些处理，关于如何处理，网上一大把资料，总结出来需要以下步骤：

1. 配置Manifest文件，添加provider
1. 对于Android7以上，在FileProvider.getUriForFile时使用配置的authority




## 参考

- [官方使用手册](https://developer.android.com/guide/topics/providers/content-provider-basics?hl=zh-cn)
- [https://blog.csdn.net/lmj623565791/article/details/72859156](https://blog.csdn.net/lmj623565791/article/details/72859156)
- [https://developer.android.com/topic/libraries/app-startup](https://developer.android.com/topic/libraries/app-startup)
