---
title: Flutter项目结构
toc: true
tags: Flutter
---

## 文件夹目录

最基础的helloworld项目结构如下：

- .dart_tool：记录了一些dart工具库所在的位置和信息
- .idea：android studio 是基于idea开发的，.idea 记录了项目的一些文件的变更记录
- android：Android项目文件夹
- ios：iOS项目文件夹
- lib：lib文件夹内存放我们的dart代码
- test：用于存放我们的测试代码
- web：网页项目文件夹
- fuchsia：fuchsia项目文件夹
- .gitignore：git忽略配置文件
- .metadata：IDE 用来记录某个 Flutter 项目属性的的隐藏文件
- .packages：pub 工具需要使用的，包含 package 依赖的 yaml 格式的文件
- flutter_app.iml：	工程文件的本地路径配置
- pubspec.lock：当前项目依赖所生成的文件
- pubspec.yaml： 当前项目的一些配置文件，包括依赖的第三方库、图片资源文件等
- README.md：	READEME文件


## pubspec.yaml详解

```yaml

name: flutter_app  #包名，如果发布一个插件到pub.dev，则该属性会作为标题出现
description: A new Flutter application.         # 项目的介绍

publish_to: 'none'  # 是否发布到dev.pub，发布命令flutter pub publish 

version: 1.0.0+1  # 版本号，version number + build number，在 Android 中 version number 对应 versionName，build number 对应 versionCode

# Flutter 和 Dart 版本控制
environment:
  sdk: ">=2.7.0 <3.0.0"

# 依赖的库配置，所有的库会编译到项目中
# 依赖库的写法有以下几种：
# 
# 1. 依赖 pub.dev 上的第三方库:    path_provider: ^1.6.22
# 2. 依赖本地库:
#      flutter_package:
#           path: ../flutter_package
# 3. 依赖 git repository:
#      bloc:
#      git:
#          url: https://github.com/felangel/bloc.git
#          ref: bloc_fixes_issue_110
#          path: packages/bloc
# 4. 依赖我们自己的 pub仓库:
#  bloc: 
#      hosted:
#          name: bloc
#          url: http://your-package-server.com
#      version: ^6.0.0
#
dependencies:
  flutter:
    sdk: flutter
# 版本的写法
# x.y.z 指定具体版本号
# <=x.y.z 或者<x.y.z  小于或者小于等于此版本的包
# >=a.b.c <x.y.z    指定版本区间，
# ^x.y.z    表示大版本不变，小版本使用最新的版本
  cupertino_icons: ^1.0.0

# 仅仅是运行期间的依赖库
dev_dependencies:
  flutter_test:
    sdk: flutter

# flutter相关的配置选项。
flutter:
  uses-material-design: true
    
# 资源文件设置
  assets:
      - images/
# 字体配置
  fonts:
    - family: Schyler
     fonts:
       - asset: fonts/Schyler-Regular.ttf
       - asset: fonts/Schyler-Italic.ttf
         style: italic
    - family: Trajan Pro
     fonts:
       - asset: fonts/TrajanPro.ttf
       - asset: fonts/TrajanPro_Bold.ttf
         weight: 700
```


### 包依赖方式

```
// 本地依赖
dependencies:
	pkg1:
        path: ../../code/pkg1
        
// 依赖github地址
dependencies:
  pkg1:
    git:
      url: git://github.com/xxx/pkg1.git
      path: packages/package1  //path参数指定相对位置
```

### 资源管理

```
flutter:
  assets:
    - assets/my_icon.png
    - assets/background.png
```

assets指定应包含在应用程序中的文件， 每个asset都通过相对于pubspec.yaml文件所在的文件系统路径来标识自身的路径。asset的声明顺序是无关紧要的，asset的实际目录可以是任意文件夹（在本示例中是assets文件夹）。

## Dart项目结构

写Dart也可按照Android的MVVM思想来划分文件夹结构

- lib
    - api：网络库
    - base：基础组件
    - data：数据model
    - model：网络请求数据的封装，方便跟后端映射
    - utils：工具类
    - view：视图文件夹
    - viewmodel：vm层


## 参考

- [https://www.dartlang.org/tools/pub/dependencies](https://www.dartlang.org/tools/pub/dependencies)
- [The pubspec file](https://dart.dev/tools/pub/pubspec)
