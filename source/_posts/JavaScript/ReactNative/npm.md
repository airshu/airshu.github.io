---
title: npm使用
tags: React Native 
---



## npm

npm配置文件为$Home/.npmrc

```
# 查看npm配置文件目录
npm config get userconfig

# 查看配置项
npm config ls
npm config ls -l #查看所有配置项
npm config list

# 编辑配置文件
npm config edit


# 获取源地址
npm config get registry

# 设置源地址
# https://registry.npmjs.org
npm config set registry http://10.193.204.59:8888/repository/group-npm/



# 创建package.json文件
npm init

# 查看所有依赖项
npm list



# 查看具体依赖的版本
npm info react-native




# 全局安装xx
npm install electron@12 -g

# 安装yarn npm替代工具
npm install -g yarn

# 更新
npm update -g xxx

# 卸载
npm uninstall --save xx  # save指从package.json文件中删除


npm publish



```



## npmrc配置文件

```

echo -n 'admin:admin' | openssl base64

```


## nvm

```

# 查看当前安装的node版本
nvm list



# 设置默认的node版本
nvm alias default v18.17.1
```


## npm与npx的区别

npm从5.2.0开始增加了npx命令

- [npx 使用教程](https://www.ruanyifeng.com/blog/2019/02/npx.html)
- [npx是什么命令？npx和npm有什么区别？](https://newsn.net/say/npx.html)



