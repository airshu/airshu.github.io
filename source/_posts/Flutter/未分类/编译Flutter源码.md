---
title: 编译Flutter源码
toc: true
tags: Flutter
---


## Mac下编译Engine



### 准备工作

```shell

# 准备depot_tools工具
# 假设当前目录是$HOME/Flutter/source
cd $HOME/Flutter/source
git clone https://chromium.googlesource.com/chromium/tools/depot_tools.git
#添加环境变量
export PATH=$PATH:$HOME/Flutter/source/depot_tools
```

### 下载源码

1. 进入github的flutter官网，fork一份engine的源码：[https://github.com/flutter/engine](https://github.com/flutter/engine)
2. 在$HOME/Flutter/source目录新建.gclient文件
```
solutions = [
	{
		"managed": False,
		"name": "src/flutter",
		"url": "git@github.com:shjlone/engine.git",//这里使用自己的仓库地址
		"custom_deps": {},
		"deps_file": "DEPS",
		"safesync_url": "",
	},
]
```
3. 运行命令：gclient sync

4. 同步最新的分支代码
```shell

cd src/flutter
git remote add upstream git@github.com:flutter/engine.git
cd ..
gclient sync

```


### 编译iOS平台


```shell
cd xxx/source #source目录为自定义的源码目录
# 下载对应Engine的Flutter Framework源码 https://github.com/flutter/flutter
cd flutter
# 不建议使用master分支，这里使用2.5.1的分支
git pull origin flutter-2.5-candidate.1:flutter-2.5-candidate.1
# 查看该分支的提交版本号
cat bin/internal/engine.version
# 进入src/flutter目录，切换分支
cd ../src/flutter
git checkout -b a877f6fed68e1b961f76ec0fece9e7c684679e75
cd ..
gclient sync

./flutter/tools/gn --ios --unoptimized
./flutter/tools/gn --unoptimized
ninja -C out/ios_debug_unopt && ninja -C out/host_debug_unopt

# 使用
cd xxx/source
./flutter/bin/flutter create hello_world
cd hello_world
# 用本地编译的Engine运行项目
../flutter/bin/flutter run --local-engine-src-path ~/flutter/source/src --local-engine=ios_debug_unopt
```


### 编译Android平台

```shell

# 预编译设备侧可执行文件
./flutter/tools/gn --android --unoptimized
#预编译arm64设备的预编译文件
./flutter/tools/gn --android --unoptimized --android-cpu=arm64
#预编译host-side可执行文件
./flutter/tools/gn --unoptimized

## 构建
# 构建设备侧可执行文件
ninja -C out/android_debug_unopt -j 8
# 构建arm64平台
ninja -C out/android_debug_unopt_arm64
# 编译host-side文件
ninja -C out/host_debug_unopt
```


## Debug源码

### Debug Java层源码

1. 将engine/src/flutter/shell/platform/android（Flutter引擎项目）目录导入Android Studio
2. 用本地Engine运行Flutter项目

```shell
../flutter/bin/flutter run --local-engine-src-path ~/flutter/source/src --local-engine=ios_debug_unopt
```
3. Flutter引擎项目进行attach，选中Show all processes

**注意**

attach的时候，有些代码已经运行过了。如果想要早一点断点，可以使用Debug.waitForDebugger()，应用一直处于等待状态，直到有Debugger连接才执行。

```kt
// 添加App文件，配置Application
package com.yourdomain.your_app_name
import android.os.Debug
import io.flutter.app.FlutterAplication

class App:FlutterApplication() {
    override fun onCreate() {
        Debug.waitForDebugger()
        super.onCreate()
    }
}
```

### Debug C++层源码





## 参考

- [Flutter 引擎编译、运行与调试](https://www.sunmoonblog.com/2020/06/10/compile-flutter-engine/)
- [Flutter-Engine-C-源码调试初探](https://fucknmb.com/2019/12/06/Flutter-Engine-C-%E6%BA%90%E7%A0%81%E8%B0%83%E8%AF%95%E5%88%9D%E6%8E%A2)
- [编译前环境准备](https://github.com/flutter/flutter/wiki/Setting-up-the-Engine-development-environment)
- [编译文档](https://github.com/flutter/flutter/wiki/Compiling-the-engine)