---
title: Mac软件安装笔记
tags: mac
---


### brew命令

```
brew services list  查看服务状态

brew services run mysql # 启动mysql 服务
brew services start mysql # 启动 mysql 服务，并注册开机自启
brew services stop mysql # 停止 mysql 服务，并取消开机自启
brew services restart mysql # 重启 mysql 服务，并注册开机自启
brew services cleanup # 清除已卸载应用的无用配置
```

### mysql

```
brew install mysql

brew services start mysql
brew services stop mysql

mysql -uroot
SHOW VARIABLES LIKE 'validate_password%'; //查看密码初始策略

SET GLOBAL validate_password.policy=LOW; //设置某个属性
SET GLOBAL validate_password.length=6; 

//修改密码
ALTER USER 'root'@'localhost' IDENTIFIED WITH caching_sha2_password BY 'yourpasswd';

flush privileges;

describe user; //查看表字段

```


使用mysql的配置脚本：/usr/local/opt/mysql/bin/mysql_secure_installation   //mysql 提供的配置向导
启动这个脚本后


### 重置密码

```
$ brew services stop mysql
$ pkill mysqld
$ rm -rf /usr/local/var/mysql/ # NOTE: this will delete your existing database!!!
$ brew postinstall mysql
$ brew services restart mysql
$ mysql -u root
```