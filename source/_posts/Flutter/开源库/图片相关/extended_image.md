---
title: extended_image
tags: Flutter
---

- [https://pub.dev/packages/extended_image](https://pub.dev/packages/extended_image)
- [https://github.com/fluttercandies/extended_image/blob/master/README-ZH.md](https://github.com/fluttercandies/extended_image/blob/master/README-ZH.md)
- [Android中图片占用内存计算方法](/Android/性能优化/Android中图片占用内存计算方法/index.html)

强大的官方 Image 扩展组件, 支持加载以及失败显示，缓存网络图片，缩放拖拽图片，图片浏览，滑动退出页面，编辑图片(裁剪旋转翻转)，保存，绘制自定义效果等功能

**图片处理过程中的一些技巧**

- 网络图片记得进行压缩，否则可能会出现内存溢出问题
- 对于常用的不变的图片，可以添加磁盘缓存，避免每次都从网络加载
