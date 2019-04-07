---
layout: post
title: Android中support的使用
category: Android
tags: Android
keywords: Android
description: 
---

### 使用support-vX包的原因

1. 向后兼容
2. 提供不适合打包进framework的功能
3. 支持不同形态的设备

### support-v4

    implemention: "com.android.support:support-v4:27.1.1"

v4名称是最开始支持api level4的库，官方在Support Library 24.2.0版本的时候移除了对Android 2.2(API Level 8)及以下版本的支持，所以从Android Support Library 24.2.0开始，V4包支持的最低版本是Android 2.3即API Level 9)，并且把v4库拆分成5个部分，可以在项目中按需要引用，但是必要性不是很大，一是因为这5个部分有依赖关系，二是compat库占了v4库的一半大小，v4库的依赖关系图：

![image](/public/img/android/support-v4.png)


Fragment:一个专为解决Android碎片化的类，通过它可以让同一个程序适配不同的屏幕。
NotificationCompat:支持更丰富的通知形式；
LocalBroadcastManager:适合于应用内的消息传递。
ViewPager:一个可以管理子view的viewgroup，用户可以在各个view之间自由切换，这个在很多应用中都有使用到；

### support-v7

V7和V4一样，同样包含多个依赖包，但和V4不同的是，V7下的多个子包并不是后面拆分开来的，而是最初发布时就以各个独立库的形式发布的。它是针对Android 2.3(API Level 9)及以上的版本谷歌提供了一系列的support包（和V4包的命名一样，V7最初支持的最低版本是Android 2.1即API Level 7，所以称其为V7，同样在Android Support Library 24.2.0将V7支持的最低版本改为Android 2.3即API Level 9了），这些support包各自对应着特定的功能，每一个都可以单独地被引用。


    implemention: "com.android.support:appcompat-v7:27.1.1",
    implemention: "com.android.support:design:27.1.1",
    implemention: "com.android.support:recyclerview-v7:27.1.1",
    implemention: "com.android.support:cardview-v7:27.1.1",
    implemention: "com.android.support:support-annotations:27.1.1",
    implemention: "com.android.support:support-vector-drawable:27.1.1",
    implemention: "com.android.support:mediarouter-v7:27.1.1",
    implemention: "com.android.support:gridlayout-v7:27.1.1",
    implemention: "com.android.support:preference-v7:27.1.1",
    implemention: "com.android.support:palette-v7:27.1.1",

- appcompat-v7：这个包支持对Action Bar接口的设计模式、Material Design接口的实现等，核心类有ActionBar、AppCompatActivity、AppCompatDialog、ShareActionProvider等。`当使用依赖这个包后，会自动引入v4包`
- design：
- recyclerview-v7：核心类是RecyclerView，用于替换ListView、GridView
- cardview-v7：支持cardview控件，使用Material Design语言设计，卡片式的信息展示，在电视App中有广泛的使用
- support-annotations：支持标注
- support-vector-drawable：
- mediarouter-v7：用于设备间音频、视频交换显示的support包
- gridlayout-v7：支持Grid Layout布局的包
- preference-v7：支持存储配置数据的包，比如CheckBoxPreference和ListPreference
- palette-v7：页面的颜色动态变换


### support-v13

这个包的作用主要是为Android3.2（API Level 13）及以上的系统提供更多地Framgnet特性支持，使用它的原因在于，android-support-v4.jar中虽然也对Fragment做了支持，由于要兼容低版本，导致他是自行实现的 Fragment 效果，在高版本的Fragment的一些特性丢失了，而对于v13以上的sdk版本，我们可以使用更加有效，特性更多的代码。

    implemention: "com.android.support:support-v13:27.1.1",
    

### support-v14



### support-v17

支持电视设备

    implemention "com.android.support:leanback-v17:27.1.1"


### AndroidX

**配置**

properties.gradle中配置

    //启用AndroidX
    android.useAndroidX=true
    //将依赖包也迁移到AndroidX
    android.enableJetifier=true

Android Studio中设置

    Refactor -> Migrate to AndroidX




### 解决依赖冲突的一些方法

**保持版本统一**

**强制设置使用某一个版本**

    android {
        configurations.all {
            resolutionStrategy.force "com.squareup.okhttp3:okhttp:3.12.1"
        }
    }

**依赖的时候使用exclude**

    implementation('me.drakeet.multitype:multitype:3.4.4', {
        exclude group: 'com.android.support'
    })


**参考**

- [https://developer.android.com/jetpack/androidx](https://developer.android.com/jetpack/androidx)
- [https://developer.android.com/jetpack/androidx/migrate](https://developer.android.com/jetpack/androidx/migrate)