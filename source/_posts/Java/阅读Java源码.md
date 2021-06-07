---
title: 阅读Java源码
tags: Java
---

## 下载OpenJDK源码

    hg clone http://hg.openjdk.java.net/jdk8/jdk8 YourOpenJDK
    cd YourOpenJDK
    bash ./get_source.sh xxx_repository
    
xxx_repository有以下几个仓库：

- jdk
- hotspot
- langtools
- corba
- jaxws
- jaxp
- corba


## 源码目录结构

Repository 	|Contains|
---          | --- 
. (root) 	|common configure and makefile logic
hotspot 	|source code and make files for building the OpenJDK Hotspot Virtual Machine
langtools 	|source code for the OpenJDK javac and language tools
jdk 	|source code and make files for building the OpenJDK runtime libraries and misc files
jaxp 	|source code for the OpenJDK JAXP functionality
jaxws 	|source code for the OpenJDK JAX-WS functionality
corba 	|source code for the OpenJDK Corba functionality
nashorn 	|source code for the OpenJDK JavaScript implementation 


## 构建


## 参考

- [http://hg.openjdk.java.net/jdk8/jdk8/raw-file/tip/README-builds.html](http://hg.openjdk.java.net/jdk8/jdk8/raw-file/tip/README-builds.html)
- [http://hg.openjdk.java.net/jdk9/jdk9/raw-file/tip/common/doc/building.html](http://hg.openjdk.java.net/jdk9/jdk9/raw-file/tip/common/doc/building.html)
