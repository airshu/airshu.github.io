---
title: 鸿蒙构建flutter项目
tags: HuaWei harmonyOS
toc: true
---








## 基础环境

```shell

sudo apt install python3
sudo apt install make
sudo apt install pkg-config
sudo apt install ninja-build

git clone https://chromium.googlesource.com/chromium/tools/depot_tools.git
export PATH="$PATH:/home/ubuntu/work/depot_tools"



# nodejs
export NODE_HOME=/home/uname/HuaWei/flutter/node-v14.19.1-mac-x64
export PATH=$NODE_HOME/bin:$PATH


# gradle
export PATH=/Users/uname/HuaWei/flutter/gradle-7.1/bin:$PATH

```



构建flutter_engine

clone源码[https://gitee.com/openharmony-sig/flutter_engine](https://gitee.com/openharmony-sig/flutter_engine)




构建flutter_flutter



## 参考

- [Flutter Love 鸿蒙](https://juejin.cn/post/7281948788483489804)
- [https://gitee.com/openharmony-sig/flutter_engine](https://gitee.com/openharmony-sig/flutter_engine)
- [https://gitee.com/openharmony-sig/flutter_flutter/tree/master](https://gitee.com/openharmony-sig/flutter_flutter/tree/master)
- [每日构建地址](http://ci.openharmony.cn/workbench/cicd/dailybuild/dailylist)

