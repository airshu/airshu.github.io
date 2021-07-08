---
title: ReentrantLock
date: 2021-05-29
toc: true
tags:
---


## 概述

ReentrantLock是重入锁。它实现了Lock接口，是基于AQS(一种用于构建同步器的框架)构造出来的一种同步器。

与synchronized相比增加了一些高级功能， 主要有以下三项:等待可中断、可实现公平锁、锁可以绑定多个条件。
