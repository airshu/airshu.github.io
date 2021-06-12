---
title: Glide
tags: Android
toc: true
---


> 此篇文章只是用于记录使用Glide时要注意的点和一些使用技巧，如需查看基本使用，
请查阅[官方文档](http://bumptech.github.io/glide/)。也可以看看[Glide原理分析](../Glide原理分析/)。

## 注意点


### **缓存等级**

- 活动缓存：
- 内存缓存：
- 磁盘缓存：InternalCacheDiskCacheFactory（默认）

### **资源缓存方式**

- DiskCacheStrategy.NONE 不缓存文件
- DiskCacheStrategy.SOURCE 只缓存原图
- DiskCacheStrategy.RESULT 只缓存最终加载的图（默认）
- DiskCacheStrategy.ALL 同时缓存原图和结果图

### **缓存键**

```java
//缓存的键包括图片的宽、高、signature等参数
EngineKey key = keyFactory.buildKey(model, signature, width, height, transformations,
resourceClass, transcodeClass, options);
```

默认策略配置



## 重要知识点

- 通过attach一个Fragment来监听Context的生命周期，合理的管理图片的加载和释放。
- Glide默认采用的是RGB-565，相比ARGB-8888内存占用会减小一半。
- 会根据ImageView的尺寸来缓存图片，


## 常用配置

### 整合OkHttp3

为了提升请求效率，使用更高效的OkHttp3来进行资源的下载。接入方式很简单，直接在gradle中引入

> compile "com.github.bumptech.glide:okhttp3-integration:4.11.0"

它会自动添加以下配置

```java
@GlideModule
public final class OkHttpLibraryGlideModule extends LibraryGlideModule {
  @Override
  public void registerComponents(@NonNull Context context, @NonNull Glide glide,
      @NonNull Registry registry) {
    registry.replace(GlideUrl.class, InputStream.class, new OkHttpUrlLoader.Factory());
  }
}
```


## 参考

- [https://github.com/bumptech/glide](https://github.com/bumptech/glide)
- [官方文档](http://bumptech.github.io/glide/)
