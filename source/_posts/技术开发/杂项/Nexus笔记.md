---
title: Nexus笔记
tags: mac
toc: true
---


## 搭建环境

```

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


## 新建nps私服