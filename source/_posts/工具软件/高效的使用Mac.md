---
title: 高效的使用Mac
tags: mac
toc: true
---

Effective use of XXX系列
- [Effective use of Mac]()
- [Effective use of iPhone]()
- [Effective use of Windows]()
- [Effective use of Firefox]()
- [Effective use of Alfred]()



**对于高效使用的理解**

所谓的高效，在笔者看来就是可以一步完成的事情，一定不要花两步。虽然Mac本身的操作已经比较人性化了，但还是有很多地方可以值得我们优化的。下面列一些场景分析一下。


场景一：想在不同软件之间快速切换。一般的做法是使用Command+Tab进行已经打开的软件间切换，使用聚焦搜索软件名进行打开。其实可以使用快捷键进行切换，参考Alfred的用法。

场景二：比如当前在文本编辑器页面写文章，突然想到某个东西需要去百度搜索一下。一般的做法是，使用Command+Tab切换到浏览器，在浏览器中新建tab页，输入baidu.com，输入关键字，进行搜索。而使用Alfred，则可以优化为：Alt+space打开Alfred搜索框，输入bd+空格，输入关键字，回车，即可自动打开浏览器搜索页。

场景三：在做复制粘贴的时候，有时候想对以前复制过的内容进行粘贴。

场景四：有一些使用率非常高的词，比如QQ号、邮箱、手机号、身份证号等信息，需要不停的输入，如果可以做到输入几个关键字就能全部输出岂不是提升了很多时间？

好了，下面正式开始动手吧！

此文致力于提高使用效率，基本的操作请读者自行阅读[官方文档](https://support.apple.com/zh-cn/guide/mac-help)或其他文档。


## Mac的基本优化

### 访达的优化

#### 显示隐藏文件

**方法一：**

使用快捷键`Command+Shift+.`

**方法二：**

终端中输入下面的命令，这种方式会长久生效。

```
隐藏
defaults write com.apple.finder AppleShowAllFiles -boolean true;killall Finder
显示
defaults write com.apple.finder AppleShowAllFiles -boolean false;killall Finder
```

#### 顶部栏显示完整路径

可以通过在访达中设置显示路径栏的方式显示，不过这种方式会在访达底部多一栏。可以通过终端输入以下命令。


```
显示完整路径
defaults write com.apple.finder _FXShowPosixPathInTitle -bool TRUE;killall Finder

隐藏完整路径
defaults delete com.apple.finder _FXShowPosixPathInTitle;killall Finder

```

![](./finder_1.png)


#### 标签的使用

这是一个非常实用的功能，将文件/文件夹标记成不同的标签，然后通过点击标签来快速定位。对于目录层次很深的文件非常有用。

使用也很简单，右键某个文件或文件夹，点击某个标签即可。标签也可以进行管理，标签的图标也可以自定义，选中标签栏中某个标签，使用command+control+空格。

![](./finder_2.png)

对于使用频率非常高的文件夹，可以直接拖拽到`个人收藏`栏，也可以拖拽到工具栏

![](./finder_3.png)



### 开机启动脚本设置

首先创建一个shell文件，根据自己的需求实现一些逻辑，比如：

```
#开机启动脚本

# 开机需要启动的程序
open /Applications/DingTalk.app
open /Applications/QQ.app

# 其他操作

#exit
```

然后给这个文件添加执行权限，chmod +x 文件名。然后设置打开方式为终端。


然后打开`系统偏好设置`-->`用户与群组`-->`登录项`，添加新建的shell文件。




## Mac上的提高效率的软件

### Alfred（神器）

由于此软件非常强大，因此单独写一篇来介绍它，`[点击查看]()`

### switchhost（hosts切换）

该软件是用来做hosts管理的，对于程序员来说非常友好，用法也很简单。可以建立一个个tab来分组管理，每个tab可以的显示隐藏互不影响。点击行号可以对该行进行快速注释或者取消注释。

[img]


### iTerm（终端的替代品）

配置

### 资源管理器工具Commander One

不完善的地方：

- 路径栏无法直接编辑，不方便直接跳转到某个路径。Total Commander的路径是可编辑的。
- 无法直接使用快捷键将当前页面显示到另外一测。Total Commander可以直接使用Ctrl+←→来操作。
- 不可配置编辑所使用的软件，只能用默认的。

### BatterZip（文件解压压缩）

### Sublime Text（文件编辑器）

轻量级文本编辑器，可配置性很强。

### CleanMyMac（优化工具）

### Dash（程序员API查询工具）

### iShot（截图、录屏工具）

### Commander One（访达替代品）


## Mac常用命令


```
lsof -i:port  查询端口对应的进程id
kill pid  杀死进程
```


## 参考





