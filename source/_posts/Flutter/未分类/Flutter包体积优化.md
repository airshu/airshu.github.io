---
title: Flutter包体积优化
toc: true
tags: Flutter
---


## 包的构成


![](./apk_size_1.png)


主要组成部分：

- so库，包含第三方依赖，flutter打包后的libapp.so等
- assets文件夹中的资源文件
- dex文件
- 字体文件
- resources.arsc文件



## 通过DevTool工具分析包体积


### 生成包体积分析文件

```bash

flutter build <your target platform> --analyze-size --target-platform=android-arm64

A summary of your APK analysis can be found at: build/apk-code-size-analysis_01.json

```

### 分析

![](./app_size_analysis.webp)



## 优化措施

- 图片压缩，可以使用tinypng工具进行压缩
- 使用相关编译参数

  - dwarf_stack_trace表示在生成的动态库文件中，不使用堆栈跟踪符号
  - obfuscate表示混淆，通过减少变量名/方法名的方式减小代码体积

```shell
//编译release包并打印size
flutter build aot --release --extra-gen-snapshot-options=--print-snapshot-sizes
//--dwarf_stack_traces， -->减少6.2%大小
flutter build aot --release --extra-gen-snapshot-options="--dwarf_stack_traces,--print-snapshot-sizes"
//--obsfuscation， -->减少2.5%大小
flutter build aot --release --extra-gen-snapshot-options="--dwarf_stack_traces,--print-snapshot-sizes,--obfuscate"

//总大小减少8.7%
```

- iOS中，删除dSYM符号表信息文件

```shell
RunCommand xcrun dsymutil -o "${build_dir}/aot/App.dSYM" "${app_framework}/App"
RunCommand xcrun strip -x -S "${derived_dir}/App.framework/App"
```

- 排除没有使用的so库

[gradle打包apk时排除指定的so文件](https://www.cnblogs.com/shenwenbo/p/16774540.html)

## 参考

- [Flutter瘦身大作战](https://www.yuque.com/xytech/flutter/hnxs1g)
- [https://flutter.cn/docs/tools/devtools/app-size](https://flutter.cn/docs/tools/devtools/app-size)
- [Flutter包大小治理上的探索与实践](https://tech.meituan.com/2020/09/18/flutter-in-meituan.html)