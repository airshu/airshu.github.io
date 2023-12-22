---
title: build_runner
toc: true
tags: Flutter
---


dart的build系统

- build_config：
- build_modules：
- build_resolvers：
- build_runner：
- build_test：
- build_web_compilers：

build_runner这个Package提供了一些用于生成文件的通用命令，常见的如json_serializable。

## build_runner

## 命令使用

```shell

dart run build_runner build
flutter pub run build_runner build

```

### 主要流程

1. 生成和预编译build脚本
2. 处理输入环境和资源
3. 根据前面的脚本和输入信息，开始正式执行builder生成代码；
4. 缓存信息，用于下一回生成代码的时候增量判断使用

### build_runner后的参数

- build：
- watch：
- serve：
- test：

### 命令行的属性

- --delete-conflicting-outputs：
- --[no-]fail-on-severe：
- --build-filter：

```shell

flutter packages pub run build_runner build --delete-conflicting-outputs

# 只编译lib/pages/xxx/目录下的文件
dart run build_runner build --build-filter="lib/pages/xxx/prefix*.dart"

```

## 参考

- [https://github.com/dart-lang/build/blob/master/docs/getting_started.md](https://github.com/dart-lang/build/blob/master/docs/getting_started.md)
- [Flutter 自定义 build_runner 的 build](https://juejin.cn/post/6844903986173050888)
- [Flutter 代码生成 source_gen 使用与原理分析](https://juejin.cn/post/7035784241665277959)
- [[Flutter] Flutter 的 build 系统(一)](https://juejin.cn/post/7133488621180420126)
- [https://pub.dev/packages/build_runner](https://pub.dev/packages/build_runner)
- [[build_runner] execute builder on only a single file #2928](https://github.com/dart-lang/build/issues/2928)