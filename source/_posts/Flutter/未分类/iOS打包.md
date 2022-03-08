---
title: iOS打包
toc: true
tags: Flutter
---


下载证书，本地安装到钥匙链中

配置Xcode





## 包体积优化

```shell
# --analyze-size参数用于生成*-code-size-analysis_*.json文件，该文件可以导入到devtools中进行分析包组成
flutter build xx  --analyze-size

# 打开devtools
flutter pub global run devtools
```

### 优化方法

#### 使用obfuscate参数

obfuscate参数会对应用进行混淆，split-debug-info参数配置符号表输出路径，用于后续解析。

```shell

flutter build apk --obfuscate --split-debug-info=/<project-name>/<directory>
```

### 参考

- [https://flutter.cn/docs/perf/app-size](https://flutter.cn/docs/perf/app-size)
- [https://flutter.cn/docs/deployment/obfuscate](https://flutter.cn/docs/deployment/obfuscate)
- [Flutter 2.0 iOS包大小优化](https://dywane.github.io/Flutter-2.0-iOS%E5%8C%85%E5%A4%A7%E5%B0%8F%E4%BC%98%E5%8C%96/)
- [手把手教你分离flutter ios编译产物-附工具](https://juejin.cn/post/6844904078154137608)