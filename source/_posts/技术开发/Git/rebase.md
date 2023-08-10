---
title: rebase
tags: Git
toc: true
---


当执行rebase操作时，git会从两个分支的共同祖先开始提取待变基分支上的修改，然后将待变基分支指向基分支的最新提交，最后将刚才提取的修改应用到基分支的最新提交的后面。



![](capture_stepup1_4_6.png)

![](capture_stepup1_4_7.png)

![](capture_stepup1_4_8.png)

![](capture_stepup1_4_9.png)

在我们的实际操作过程中，会发现要对多次commit进行冲突处理就是因为要生成新的提交记录


在实际开发过程中，rebase一般用于合并主分支代码到开发分支

## 参考

- [git rebase详解（图解+最简单示例，一次就懂）](https://blog.csdn.net/weixin_42310154/article/details/119004977)
- [分支的合并](https://backlog.com/git-tutorial/cn/stepup/stepup1_4.html)
- [git-rebase](https://www.kancloud.cn/apachecn/git-doc-zh/1945518)