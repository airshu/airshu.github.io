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


### pubspec.yaml详解



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
