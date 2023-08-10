---
title: Git使用技巧
tags: Git
toc: true
---


## amend

将本地提交和最后一次提交合并成一个新的提交

```
git commit --amend
```

## rebase 交互式变基9

**使用场景**

- 调整提交记录的顺序（通过鼠标拖放来完成）
- 删除你不想要的提交（通过切换 pick 的状态来完成，关闭就意味着你不想要这个提交记录）
- 合并提交，允许你把多个提交记录合并成一个

```shell

# Commands:
# p, pick <commit> = use commit
# r, reword <commit> = use commit, but edit the commit message
# e, edit <commit> = use commit, but stop for amending
# s, squash <commit> = use commit, but meld into previous commit
# f, fixup [-C | -c] <commit> = like "squash" but keep only the previous
#                    commit's log message, unless -C is used, in which case
#                    keep only this commit's message; -c is same as -C but
#                    opens the editor
# x, exec <command> = run command (the rest of the line) using shell
# b, break = stop here (continue rebase later with 'git rebase --continue')
# d, drop <commit> = remove commit
# l, label <label> = label current HEAD with a name
# t, reset <label> = reset HEAD to a label
# m, merge [-C <commit> | -c <commit>] <label> [# <oneline>]
# .       create a merge commit using the original merge commit's
# .       message (or the oneline, if no original merge commit was
# .       specified); use -c <commit> to reword the commit message
#
# These lines can be re-ordered; they are executed from top to bottom.
#
# If you remove a line here THAT COMMIT WILL BE LOST.
#
# However, if you remove everything, the rebase will be aborted.
#


# 合并最近4条提交记录， -i 表示交互界面
git rebase -i HEAD~4
```

### 命令参数

#### p, pick = use commit

pick，简写p，意思是使用commit。git-rebase内的commits默认都是pick命令，意思是选择这个commit，不需要任何改动

#### r, reword = use commit, but edit the commit message

reword, 简写r，意思是使用commit，但是需要编辑（修改）commit message。

#### e, edit = use commit, but stop for amending

edit，简写e，意思是可以暂时停止rebase，此时允许修改文件内容、允许修改commit message，然后继续rebase。

#### s, squash = use commit, but meld into previous commit

squash，简写s，意思是使用commit，但是把修改的内容融入到上一个commit，这个命令用来合并多个commit。

#### f, fixup = like "squash", but discard this commit's log message

fixup， 简写f，与squash意思一样，但是直接丢弃commit message。

#### x, exec = run command(the rest of the line) using shell

exec，简写x，意思是在rebase过程中执行脚本命令。

#### d, drop = remove commit

drop，简写d，意思是移除commit



## 参考

- [Android Studio 实战 git-rebase 交互式变基高阶技巧](https://juejin.cn/post/7023383442217762829)