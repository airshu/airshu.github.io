---
title: JNI笔记
tags: Android
toc: true
---



### JNI开发流程


- 编写声明了native方法的Java类
- 将Java源代码编译成class字节码文件
- 用javah -jni 命令生成.h头文件（javah 是 jdk 自带的一个命令，-jni 参数表示将 class 中用native 声明的函数生成 JNI 规则的函数）
- 用本地代码实现.h头文件中的函数
- 将本地代码编译成动态库（Windows：\*.dll，linux/unix：\*.so，mac os x：\*.jnilib）
- 拷贝动态库至 java.library.path 本地库搜索目录下，并运行 Java 程序


### JVM查找native方法的规则

### JNI数据类型与Java数据类型的映射关系

### 字符串处理

### 访问数组

### C/C++访问Java实例方法和静态方法

### C/C++访问Java实例变量和静态变量

### JNI调用构造方法和父类实例方法

## 参考

- [https://developer.android.com/training/articles/perf-jni](https://developer.android.com/training/articles/perf-jni)
- [wiki.jikexueyuan.com/project/jni-ndk-developer-guide/](wiki.jikexueyuan.com/project/jni-ndk-developer-guide/)
