---
title: Android逆向之脱壳
tags: Android
---

有些App为了安全，会使用相关加壳工具来提高破解难度。但其实意义不大，通过hook，应该是很容易获取内存dump出dex文件的。还记得以前进行
flash游戏破解的时候，当时使用一个技巧，通过flash的运行机制，在swf启动的时候将自己写的swfload进来并运行，运行的代码就是将内存中的
swf导出来。破解成功的概率非常高。而个人认为，通过代码混淆来增加阅读难度比加壳的作用更有用。

最近看到某款竟品，于是想学习学习，直接放到Jadx中，嗯哼，竟然使用了腾讯乐固。了解了大致破壳的原理，其实就算自己实现也是可行的。不过
自己能想到的事情，可能有人早就想到了。搜一搜吧，果然有很多破解工具。有些文章可以参考参考、学习学习：

- [https://crifan.github.io/android_app_security_crack/website/](https://crifan.github.io/android_app_security_crack/website/)

我们的目的是为了快速获取dex，阅读源码，所以就不折腾每个工具是怎么实现的了。找到文章说的工具，一个一个试吧。最终发现ReflectMaster可以dump
出来dex。使用如下：


1. 安装ReflectMaster，下载地址：[https://www.lanzous.com/i6x1kaf](https://www.lanzous.com/i6x1kaf)
2. 在xposed环境中，安装并激活。
3. 启动对应带壳的App，点击"中间的图标"，点击"当前Activity"，点击"导出dex"。

确认使用腾讯乐固：
![](./crack_2.jpg)

导出的dex如下：

![](./crack_1.jpg)


## 参考

- [https://github.com/FormatFa/ReflectMaster](https://github.com/FormatFa/ReflectMaster)
- [https://www.kanxue.com/chm.htm?id=9948&pid=node1000000](https://www.kanxue.com/chm.htm?id=9948&pid=node1000000)
- [https://blog.csdn.net/qq_41855420/article/details/106276824](https://blog.csdn.net/qq_41855420/article/details/106276824)
- [https://www.kanxue.com/chm.htm?id=9948&pid=node1000000](https://www.kanxue.com/chm.htm?id=9948&pid=node1000000)





