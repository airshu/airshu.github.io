---
title: Glide
tags: Android
toc: true
---

## 概述


## 开始使用

### gradle配置

```
dependencies {
    implementation 'com.github.bumptech.glide:glide:4.11.0'
    // Skip this if you don't want to use integration libraries or configure Glide.
    annotationProcessor 'com.github.bumptech.glide:compiler:4.11.0'
}
```


### 权限配置

```
<uses-permission android:name="android.permission.INTERNET"/>
<!--
Allows Glide to monitor connectivity status and restart failed requests if users go from a
a disconnected to a connected network state.
-->
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>
```

### 混淆文件配置

```
-keep public class * implements com.bumptech.glide.module.GlideModule
-keep public class * extends com.bumptech.glide.module.AppGlideModule
-keep public enum com.bumptech.glide.load.ImageHeaderParser$** {
  **[] $VALUES;
  public *;
}

If you're targeting any API level less than Android API 27, also include:
```pro
-dontwarn com.bumptech.glide.load.resource.bitmap.VideoDecoder
```

VideoDecoder uses API 27 APIs which may cause proguard warnings even though the newer APIs won’t be called on devices with older versions of Android.

If you use DexGuard you may also want to include:

```
# for DexGuard only
-keepresourcexmlelements manifest/application/meta-data@value=GlideModule
```

### 基本使用

```java

```

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
