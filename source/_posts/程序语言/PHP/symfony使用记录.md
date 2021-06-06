---
title: Symfony使用记录
tags: PHP
toc: true
---

## Symfony中请求的流程




### 如何在新接口部署的时候平稳的切换缓存

使用php console cache:warmup命令，进行缓存预热，当缓存文件全部生成好后，即可平稳当切换。而不是手动删除缓存文件，待请求来之后再生成缓存。

#### **参考**

- [https://blog.whiteoctober.co.uk/index.html%3Fp=1751.html](https://blog.whiteoctober.co.uk/index.html%3Fp=1751.html)