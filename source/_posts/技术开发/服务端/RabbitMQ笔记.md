---
title: RabbitMQ笔记
tags: 服务端
---

## 安装

#### 安装PHP扩展amqp

```
PHP < 7.3

#install some base extensions
RUN apt-get install -y \
        libzip-dev \
        zip \
  && docker-php-ext-configure zip --with-libzip \
  && docker-php-ext-install zip

PHP >= 7.3

#install some base extensions
RUN apt-get install -y \
libzip-dev \
zip \
&& docker-php-ext-install zip
```

#### 安装RabbitMQ

docker安装，使用localhost:5672访问其后台

```
rabbitmq:
        image:rabbitmq:management
        restart: always
        environment:
            RABBITMQ_DEFAULT_USER: "root"
            RABBITMQ_DEFAULT_PASS: "root"
        volumes:
            - ./code/rabbitmq/rabbitmq:/var/lib/rabbitmq
            - ./code/rabbitmq/log:/log/rabbitmq/log
        ports:
            - 15672:15672
            - 5672:5672
```
   

#### Symfony安装扩展

[https://github.com/php-amqplib/RabbitMqBundle](https://github.com/php-amqplib/RabbitMqBundle)

1. Symfony中的composer中添加

```
"php-amqplib/rabbitmq-bundle": "1.14.4"
```

2. 执行更新命令

```
php composer update php-amqplib/rabbitmq-bundle
```


## 使用



## 参考
- [https://rabbitmq.com](https://rabbitmq.com)
- [https://blog.csdn.net/whoamiyang/article/details/54954780](https://blog.csdn.net/whoamiyang/article/details/54954780)