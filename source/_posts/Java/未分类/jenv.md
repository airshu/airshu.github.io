---
title: jenv
tags: Java
toc: true
---

## 概述

有时候，我们可能需要在电脑中安装多个Java环境，在不同的场景切换版本，我们需要修改JAVA_HOME、PATH等环境变量。
每次改起来就很繁琐。我们也可以自己写一个shell命令，来动态切换不同的版本。jenv就是帮我们解决了这个问题。

jenv支持在当前shell、文件夹、全局切换不同的Java版本


## 安装和配置

### 安装

```java
brew install jenv
```

### 配置

我们一般先下载对应的JDK/JRE的压缩包，然后即可进行配置。

```shell

运行以下命令添加环境变量
export PATH="$HOME/.jenv/bin:$PATH" eval "$(jenv init -)"

添加JAVA_HOME，每次切换后只需要source一下，就会更新此变量
export JAVA_HOME="$HOME/.jenv/versions/`jenv version-name`"


# 添加java版本
jenv add /Library/Java/JavaVirtualMachines/jdk1.7.0_80.jdk/Contents/Home

jenv versions  # 查看所有版本
  system
  1.8
* 1.8.0.252 (set by /Users/loneqd/.java-version)
  1.8.0.51
  16.0
  16.0.1
  openjdk64-1.8.0.252
  openjdk64-16.0.1
  oracle64-1.8.0.51

# 切换当前目录下的jdk版本，如切换当前目录下的版本为1.6
jenv local 1.8

# 全局切换版本，如下切换为1.7
jenv global 1.7

# 当前shell中使用某个版本
jenv shell 1.6

# 查看当前使用版本
jenv version



```


## 参考

- [Java8相关环境下载地址](https://www.oracle.com/java/technologies/javase/javase8-archive-downloads.html)
- [https://www.jenv.be/](https://www.jenv.be/)
- [https://github.com/jenv/jenv/issues/44](https://github.com/jenv/jenv/issues/44)
