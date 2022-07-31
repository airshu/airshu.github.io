---
title: Gerrit使用笔记
category: 工具软件
tags: 效率
toc: true
---

Gitlab、Github的Pull Request功能可以进行Code Review，但Gerrit更强大，可以搭配Jenkins、LDAP等在企业内部搭建完善的Code Review流程。这里记录下自己对其的了解，方便在工作中使用它。

## 安装

```shell


# 下载war包
wget https://gerrit-releases.storage.googleapis.com/gerrit-3.1.3.war

# 安装
java -jar gerrit*.war init --batch --dev --install-all-plugins -d ~/gerrit_testsite
# —batch 默认使用一些配置
# —dev 开发环境
# -d 安装目录
# --install-all-plugins 安装插件
```

### 文件夹结构

- bin：命令存放目录
    - gerrit.sh：gerrit服务控制命令
- cache:
- data:
- etc：配置文件保存目录
    - gerrit.config：端口配置，反向代理配置，等等
- git：项目源码保存目录
- logs：日志文件存储目录
- plugins：插件存储目录
- static:
- tmp:

### 基本命令

```shell
cd $GERRIT_SITE/bin
gerrit.sh start
gerrit.sh stop
gerrit.sh restart
```

### Gerrit配置

```shell
[gerrit]
    basePath = D:\\Program Files (x86)\\PortableGit\\bin
    serverId = c08372c6-a331-4dce-a236-f4c93211f236
    canonicalWebUrl = http://192.168.40.8:7001/  # 访问地址
[database]
    type = mysql
    hostname = localhost
    database = gerrit
    username = root
[index]
    type = LUCENE
[auth]
    type = HTTP  # 授权方式，可以使用HTTP的方式关联Apache、Nginx；也可以使用LDAP等
[receive]
    enableSignedPush = false
[sendemail]
    smtpServer = localhost
[container]
    user = PC074
    javaHome = d:\\Program Files\\Java\\jdk1.8.0_121\\jre
[sshd]
    listenAddress = *:123 # 端口绑定
[httpd]
    listenUrl = http://192.168.40.8:7001/  
[cache]
    directory = cache
```


### auth类型配置


## 反向代理配置


## 基本使用

> 第一个注册的用户是超级管理员，ID为1000000

### 使用基本流程：

1. 创建账号，添加ssh公钥
2. 配置仓库
3. 给用户分配权限
4. 创建Change
5. push代码进行Review流程

### 开发者使用

```shell
# 拉取代码
git clone "ssh://xxx@xx.xxx.201.148:12304/All-Projects" && scp -p -P 12304 longsj@47.113.201.148:hooks/commit-msg "All-Projects/.git/hooks/"

##修改
vim Readme.MD
git add Readme.MD
git commit -m "change xxx"
# 推送修改，推送成功后gerrit后台会有change记录
git push origin HEAD:refs/for/HEAD
# origin : 是远程的库的名字
# HEAD: 是一个特别的指针，它是一个指向你正在工作的本地分支的指针，可以把它当做本地分支的别名，git这样就可以知道你工作在哪个分支
# refs/for :意义在于我们提交代码到服务器之后是需要经过code review 之后才能进行merge的，for表示指向某个分支


```

## 参考

- [Gerrit使用说明](http://gitlab.aotimes.com/root/readme/blob/master/Gerrit%E4%BD%BF%E7%94%A8%E8%AF%B4%E6%98%8E.md)