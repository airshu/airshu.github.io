---
title: Git使用笔记
tags: Git
toc: true
---

<br/>

## 基本命令

```shell
git init   #  输出 Initialized empty Git repository in .git/    建立空仓库
git add .  #添加到仓库  把所有修改提交到暂存区(Stage)
git commit -m "提交注释" #提交到仓库    把暂存区的所有修改提交到分支
git push remote_branch local_branch #将本地库提交到远程库
git status #查看修改状态

git log #显示从最近到最远的提交日志
git log -2： #查看最近几条记录

git clone git@github.com:xxx/gitskills.git #克隆仓库

#checkout 检查工作目录代码与本地仓库中的代码的差异
git checkout -b dev #创建并切换分支，相当于下面的两句
git branch experimental     #创建分支
git checkout experimental #切换到分支



git fetch -u origin master #拉取远程仓库名为origin的master分支代码到本地仓库，并不修改本地工作目录的代码，如果要修改，则进行git merge变更合并

#merge 将远程仓库的变更，更新到本地工作目录中
git merge 分支名 #合并分支到当前分支上

#git pull相当于git fetch + git merge

#remote 用于管理远程仓库
git remote -v #查看现有的远程仓库
#添加一个远程仓库
git remote add <仓库名字> <仓库的URL>
git remote add pb git://github.com/paulboone/ticgit.git #添加一个远程仓库 并用pb命名。
git remote rm paul #删除远程仓库
git remote rename pb paul #重名远程仓库 本地也会跟着修改


#git push -u <远程仓库名字> <远程仓库的某一分支名字>
git push -u test mater  #将本地仓库的变更推送远程仓库的master分支
git push origin 标签名 #推送标签到远程仓库
git push origin --tags #推送所有标签到远程仓库
git push origin :refs/tags/标签名 #从远程仓库中删除标签
git push origin --delete <branchname>     #删除远程分支
git push origin :<branchName>     #删除远程分支



#暂存操作：
git stash 暂存当前修改
git stash apply 恢复最近的一次暂存
git stash pop 恢复暂存并删除暂存记录
git stash list 查看暂存列表
git stash drop 暂存名(例：stash@{0}) 移除某次暂存
git stash clear 清除暂存

#回退操作：
#Git服务有一个叫HEAD的版本指针，当用户申请还原数据时，其实就是将HEAD指针指向到某个特定的提交版本。
#git reset 通过把分支记录回退几个提交记录来实现撤销改动。你可以将这想象成“改写历史”。git reset 向上移动分支，原来指向的提交记录就跟从来没有提交过一样。在reset后， C2 所做的变更还在，但是处于未加入暂存区状态。
#虽然在你的本地分支中使用 git reset 很方便，但是这种“改写历史”的方法对大家一起使用的远程分支是无效的哦！
#为了撤销更改并分享给别人，我们需要使用 git revert。新提交记录 C2' 引入了更改 —— 这些更改刚好是用来撤销 C2 这个提交的。也就是说 C2' 的状态与 C1 是相同的。

git reset --hard HEAD^ #回退到上一个版本
git reset --hard ahdhs1(commit_id) #回退到某个版本
git checkout -- file  #撤销修改的文件(如果文件加入到了暂存区，则回退到暂存区的，如果文件加入到了版本库，则还原至加入版本库之后的状态)
git reset HEAD file #撤回暂存区的文件修改到工作区
git revert HEAD



#标签操作：
#tag的作用是方便用户回滚操作，只需要记住tag的名字就能迅速回滚
git tag #列出所有标签列表，可以按照标签进行checkout
git tag 标签名 #添加标签(默认对当前版本)
git tag 标签名 commit_id #对某一提交记录打标签

git tag -a 标签名 -m '描述' #创建新标签并增加备注
git show 标签名 #查看标签信息
git tag -d 标签名 #删除本地标签


#git rm提交删除文件的变更到暂存区

git diff test.txt 本地工作目录中到文件与本地仓库中的文件对比


# 时光机，查看提交记录
git reflog 

```


### Git分支管理

master分支一般用于发布新版本，dev分支用于开发，每个人从dev分支创建自己的个人分支，开发完合并到dev分支，最后合并到master分支。

```shell
git branch   查看所有已存在的分支
git branch -a 查看远程分支
git branch -v 查看所有分支的最后一次操作
git branch -vv 查看当前分支
git brabch -b 分支名 origin/分支名 //创建远程分支到本地
git branch --merged //查看别的分支和当前分支合并过的分支
git branch --no-merged //查看未与当前分支合并的分支
git branch -d xxx 删除本地分支
git branch -D crazy-idea 强制删除分支

git merge 功能1   #合并功能1分支到当前分支
git branch -d 功能1   # 删除功能1分支（当前不能在功能1分支、删除的是本地分支）
```

<br/>

### gitignore文件

用来存储不需要进行版本管理的文件

### 文件匹配规则

```shell
*.log  # 表示忽略项目中所有以.log结尾的文件
123?.log  # 忽略所有以123加任意一个字符，且以.log结尾的文件
/error.log  # 忽略根目录下的error.log文件
**/java/  # 忽略所有java目录下的所有文件
!/error.log  # 表示在前面的匹配规则中，被忽略了的文件，你不想它被忽略，那么就可以在文件前面加叹号
```
 


## 拉取体积很大的仓库

```
git clone --depth 1 仓库地址
git branch -a
git remote set-branches origin '远程分支名称’
git fetch --depth 1 origin 远程分支名称
git checkout ‘远程分支名称’
```

<br/>

## 仓库之间的迁移


### 整个仓库迁移

```
git clone --bare 旧仓库地址
git push --mirror 新仓库地址

```

### 迁移一个分支

```
git remote add 本地分支 新仓库地址  //关联远程分支
git push 远程分支 本地分支    //提交分支
```


## SourceTree

### Could not read from remote repository解决办法

```shell
cd ~/.ssh
# 确认将公钥添加到服务器
# 验证
ssh -T git@github.com
ssh-add id-rsa
```


## Sourcetree使用

### Permission denied错误

```
git@github.com: Permission denied (publickey).

fatal: Could not read from remote repository.

Please make sure you have the correct access rights

and the repository exists.
```

Mac每次重启之后就无法在Sourcetree连接服务器了，原因是私钥没有添加到钥匙链中，需要执行以下命令：

```shell
#ssh-add参数
-D：删除ssh-agent中的所有密钥.
-d：从ssh-agent中的删除密钥
-e pkcs11：删除PKCS#11共享库pkcs1提供的钥匙。
-s pkcs11：添加PKCS#11共享库pkcs1提供的钥匙。
-L：显示ssh-agent中的公钥
-l：显示ssh-agent中的密钥
-t life：对加载的密钥设置超时时间，超时ssh-agent将自动卸载密钥
-X：对ssh-agent进行解锁
-x：对ssh-agent进行加锁

ssh-add -K !/.ssh/id_rsa

#查看ssh-agent中的密钥
ssh-add -l

```


## 移动HEAD

```
# 切换到指定id
git checkout commit_id
# 指定提交
git branch -f branch_name HEAD~1
# 上一个提交
git branch -f branch_name HEAD^ 


```