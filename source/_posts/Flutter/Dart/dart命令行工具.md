---
title: dart命令行工具
toc: true
tags: Dart
---

## dart analyze 命令

代码分析工具

```shell

# 设置分析等级 --no-fatal-warnings
dart analyze --fatal-infos

# 指定目录或文件
dart analyze [<DIRECTORY> | <DART_FILE>]

```

## dart compile 命令

编译dart文件

### 子命令

- exe: 编译成可执行文件
- aot-snapshot：编译成AOT快照
- jit-snapshot：编译成JIT快照
- kernel：编译成kernel文件
- js：编译成js文件

```shell

dart compile exe main.dart -o main.exe
# 查看子命令用法
dart compile exe --help

```

## dart create 命令

创建Dart项目，通过-t参数设置不同的项目模版

模版类型

- cli
- console
- package
- server-shelf
- web

## dart doc 命令

生成文档

## dart fix 命令

查找和修复代码中的问题

```shell

# 预览建议的修改
dart fix --dry-run

# 应用建议的修改
dart fix --apply

dart fix --apply --code annotate_overrides 
dart fix --apply --code prefer_const_constructors 
dart fix --apply --code prefer_const_declarations 
dart fix --apply --code unnecessary_brace_in_string_interps 
dart fix --apply --code unnecessary_cast 
dart fix --apply --code unused_import 

```

## dart format 命令

格式化代码

```shell

# 设置目录
dart format .

# 下面的命令将会对 lib 目录中的所有 Dart 文件，以及一个 bin 目录下的 Dart 文件进行格式整理
dart format lib bin/updater.dart 
```

## dart pub 命令

管理依赖

### 子命令

- add:
- cache: 管理本地缓存
- deps: 显示当前Package使用的所有依赖项
- downgrade: 检索当前Package所依赖的其他Package的最低版本
- get: 用于检索当前 Package 所依赖的其它 Package。如果 pubspec.lock 文件已经存在，则根据该文件中保存的依赖项版本获取对应的依赖项。如有必要，将会创建或更新该文件。
- global:
- outdated: 查看当前软件包所依赖的每个 package，确定哪些 package 的依赖项已过时，并为您提供有关如何更新它们的建议。当您要更新 package 的依赖性时，请使用此命令。
- publish:
- remove:
- token:
- upgrade: 用于检索当前 Package 所依赖的其它 Package 的最新版本。如果 pubspec.lock 文件已经存在，则忽略其保存的版本并以 pubspec 文件中指定的最新版本为主。如有必要，将会创建或更新该文件。

## dart run 命令

```shell
dart run [options] [<DART_FILE> | <PACKAGE_TARGET>] [args]

# 运行一个Dart程序
dart run tool/debug.dart

# 启动断言
dart run --enable-asserts tool/debug.dart

# 使用开发者工具来调试和性能分析
dart run --observe tool/debug.dart
```

## dart test 命令

运行测试脚本

## build runner 命令

build_runner 的命令需要与使用 Dart 编译系统 从输入文件生成输出文件的生成器 Package 配合使用。例如，json_serializable 与 built_value_generator 这两个 Package 共同定义了生成 Dart 代码的生成器。

```shell


dart run build_runner build

dart packages pub run build_runner build --delete-conflicting-outputs

```