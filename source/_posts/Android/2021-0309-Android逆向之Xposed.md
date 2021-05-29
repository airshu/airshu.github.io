---
title: Android逆向之Xposed
tags: Android
---

[Xposed](https://repo.xposed.info)的作用非常强大，以前虽然也大致了解，但没有自己实践过。最近在做其他App分析的时候，发现其限制了模拟器的
使用，于是想着逆向破解一下，于是开启了Xposed之旅。

首先阅读下官网，嗯，版本很久没有更新了，后面又出现了"太极"之类的新的工具。就不折腾那么多了，先以快速解决问题为目标。下载雷电模拟器，其版本为Android7.1.2。
进入"雷电游戏中心"搜索xposed，下载对应的App，打开后点击安装，重启。

![](/public/img/mac/xposed_1.png)


## Hello World

下一步完成一个最简单的Hello World，网上搜有一大把。总结下：

- 添加依赖，目前最新的版本为82：
```
compileOnly 'de.robv.android.xposed:api:82'
compileOnly 'de.robv.android.xposed:api:82:sources'
```

- 修改AndroidManifest.xml文件，添加相应标识，用于Xposed识别。
```
<meta-data
    android:name="xposedmodule"
    android:value="true" />

<meta-data
    android:name="xposeddescription"
    android:value="这是一个Xposed例程" />

<meta-data
    android:name="xposedminversion"
    android:value="53" />
```

- 新建assets文件夹，添加xposed_init文件，添加hook启动入口，文件内容为你的hook类。
  
- 添加hook类，实现IXposedHookLoadPackage，实现handleLoadPackage方法。

## 熟悉API

- [https://api.xposed.info/reference/packages.html](https://api.xposed.info/reference/packages.html)

```Java
/**
当App装载的时候会被调用，被调用的非常早，比Application.onCreate还早。
*/
public abstract void handleLoadPackage (XC_LoadPackage.LoadPackageParam lpparam)

```




## xposed工具

### 开发者助手:
下载地址：[https://github.com/WrBug/DeveloperHelper](https://github.com/WrBug/DeveloperHelper)

可以直接在界面上看到UI的名字，可以查看log

### **Inspeckage：**
下载地址：[https://repo.xposed.info/module/mobi.acpm.inspeckage](https://repo.xposed.info/module/mobi.acpm.inspeckage)

在网页上看相关信息：包信息，Shared Preferences，使用了Crypto、Hash的记录，抓包信息等

### JustTrustMe：
[https://github.com/Fuzion24/JustTrustMe](https://github.com/Fuzion24/JustTrustMe)

### UCrack：
[https://gitee.com/virjar/ucrack](https://gitee.com/virjar/ucrack)

一个基于Xposed写的辅助工具，集成了自动网络抓包、网络堆栈爆破、文件日志、WebView调试环境、自动脱壳、Native函数注册监控、
记录程序自杀堆栈等功能。

### **ReflectMaster（反射大师）：**
[https://github.com/FormatFa/ReflectMaster](https://github.com/FormatFa/ReflectMaster)

可以从当前页面提取dex，对于加壳的App很有用。

