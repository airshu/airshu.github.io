---
title: CodePush
tags: React Native 
---



## 基本使用

1. 安装CodePush CLI
2. 注册账号
3. 注册App
4. 原生端配置
5. RN代码集成
6. 发布

```shell
#安装
npm install -g code-push-cli

#注册
code-push register

#登录
code-push login

#列出登录的token
code-push access-key ls

#删除某个key
code-push access-key rm [accessKey] 

#注册App
# <os> - ios、windows、android
# <platform> - react-native、cordova...
code-push app add [appName] [os] [platform]


code-push app add 在账号里面添加一个新的 App
code-push app rm 在账号里移除一个 App
code-push app rename 重命名一个存在 App
code-push app ls 列出账号下面的所有 App
code-push app transfer 把 app 的所有权转移到另外一个账号

#发布
code-push release-react [AppName] android

code-push release-react [AppName] ios
```


