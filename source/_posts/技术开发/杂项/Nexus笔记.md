---
title: Nexus笔记
tags: mac
toc: true
---

Nexus作为私有仓库，可以用来存储jar、aar、js库，一般公司内可以搭建一个用来存储共用的库，一来可以提升同步时间，一来统一管理基础库，提升开发效率。

## 搭建环境

```shell

# 下载安装包
https://www.sonatype.com/products/sonatype-nexus-oss

# 解压到$HOME/tools文件夹下

# 设置软链
ls -s /Users/liuyunxia/tools/nexus-3.55.0-01-mac/nexus-3.55.0-01 /Users/liuyunxia/tools/nexus-3.55.0-01-mac/nexus-latest


# 往 ~/.bash_profile 文件添加如下两行
export NEXUS_HOME=/Users/liuyunxia/tools/nexus-3.55.0-01-mac/nexus-latest
PATH=$PATH:$NEXUS_HOME/bin

# 执行如下命令使添加到 ~/.profile 文件的配置生效
source ~/.bash_profile



nexus start
nexus stop
nexus restart


```


## 新建npm私有仓库


- [使用 Maven Publish 插件](https://developer.android.com/studio/build/maven-publish-plugin?hl=zh-cn)
- [使用nexus3配置npm私有仓库](https://wiki.eryajf.net/pages/1956.html)