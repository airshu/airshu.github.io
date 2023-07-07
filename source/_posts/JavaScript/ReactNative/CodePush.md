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

#安装appcenter工具
npm install -g appcenter-cli

#登录
appcenter login

#登出
appcenter logout


appcenter tokens list
appcenter tokens delete <machineName>



#查看账户信息
appcenter profile list


# 1、创建iOS应用
appcenter apps create -d MyApp-iOS -o iOS -p React-Native
# 2、创建Android应用
appcenter apps create -d MyApp-Android -o Android -p React-Native


# 查询账号下的所有应用
appcenter apps list

appcenter apps delete -a <ownerName>/<appName>



# ownerName：用户名称
# appName：创建的应用名称

# 创建部署
appcenter codepush deployment add -a <ownerName>/<appName> Staging
# 配置生产环境
appcenter codepush deployment add -a <ownerName>/<appName> Productionn

# ownerName：用户名称
# appName：创建的应用名称

# 删除应用的开发环境
appcenter codepush deployment remove -a <ownerName>/<appName> Staging
# 删除应用的生产环境
appcenter codepush deployment remove -a <ownerName>/<appName> Production


#查询应用key
appcenter codepush deployment list -a <ownerName>/<appName> -k

#发布
appcenter codepush release-react -a airdady/test -t 1.0.11 -o ./build -d Staging

```


