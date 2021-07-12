---
title: HTTPS
tags: 服务端
toc: true
---


## 工作流程

![](./https_1.png)

1. Client发起一个HTTPS(比如 https://juejin.im/user )的请求，根据RFC2818的规定，Client知道需要连接Server的443(默认)端口。
2. Server把事先配置好的公钥证书(public key certificate)返回给客户端。
3. Client验证公钥证书:比如是否在有效期内，证书的用途是不是匹配Client请求的站点，是不是在CRL吊销列表里面，它的上一级证书是否有效，这是一个递归的过程，
   直到验证到根证书(操作系统内置的Root证书或者Client内置的Root证书)。如果验证通过则继续，不通过则显示警告信息。
4. Client使用伪随机数生成器生成加密所使用的对称密钥，然后用证书的公钥加密这个对称密钥，发给Server。
5. Server使用自己的私钥(private key)解密这个消息，得到对称密钥。至此，Client和Server双方都持有了相同的对称密钥。
6. Server使用对称密钥加密“明文内容A”，发送给Client。
7. Client使用对称密钥解密响应的密文，得到“明文内容A”。
8. Client再次发起HTTPS的请求，使用对称密钥加密请求的“明文内容B”，然后Server使用对称密钥 解密密文，得到“明文内容B”。


## 参考


