---
title: 如何提升Android应用的安全
tags: Android
toc: true
---

### 权限设置

- 尽量使用更少的权限，动态获取权限。
- release版本中设置日志输出等级

### 危险代码检测

确认代码中是否使用插件化技术，hook技术

### 源文件安全

- Java代码混淆
- 底层代码加固
- 密钥等信息是否存在暴露风险
- 启动时进行签名检查（防止二次打包）

### 数据存储安全

- 是否明文存储配置信息
- 数据库存储的安全
- 是否暴露不必要的组件，检查exported属性

### 数据传输安全

- 是否存在网络数据被拦截的风险
- 是否使用Https






## 参考

- [https://blog.csdn.net/u013107656/category_6257625.html](https://blog.csdn.net/u013107656/category_6257625.html)
