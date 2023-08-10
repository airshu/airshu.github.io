---
title: merge
tags: Git
toc: true
---



merge用于分支的合并

```shell
git merge branch_name


```

## 参数

### -ff：快速合并

![](capture_setup1_4_1.png)
![](capture_setup1_4_2.png)

### --ff-only：只有能快速合并的时候才合并


### --no-ff：不使用快速合并，生成一次新的提交记录

![](capture_setup1_4_3.png)
![](capture_setup1_4_4.png)

如果设置了此参数，即使可以快速合并，也会生成一次新的提交记录

### --squash：压缩合并，将待合并的分支的内容压缩成一个新的提交合并进来

此种方式用于将多个提交记录合并成一个提交记录，比如进行gerrit review时使用
