---
title: Firefox插件推荐
category: 工具软件
tags: 效率
toc: true
---


## **AdGuard**

去广告神器

- [https://github.com/AdGuardTeam/AdGuardBrowserExtension](https://github.com/AdGuardTeam/AdGuardBrowserExtension)

<br/>

## **In My Pocket**

将网页内容缓存起来，方便以后阅读，查看。

<br/>

## **JSON Lite**

对json类型格式化显示

<br/>

## **Octotree**

Github的文件目录用树形表示

<br/>

## **Greasemonkey**

脚本管理器

<br/>

## **Dark Reader**

设置黑色主题

<br/>

## **印象笔记·剪藏**

保存网页内容到Evernote

<br/>

## **iCloud书签**

同步Firefox和Safira书签


## New Tab Suspender

内存占用过大时，自动挂起标签页。省内存


## Sidebery

侧边栏标签页管理器。如果使用的笔记本，屏幕的高度是很珍贵的，在使用浏览器时我会尽量节省高度，比如将书签栏隐藏，书签放到跟地址栏同一行。标签栏也可以隐藏，Sidebery可用于在侧边管理标签，相比默认的标签栏，它更方便。
可以分组管理，标签可以按树形排列，推荐使用。


### 如何隐藏Firefox的标签栏

Firefox的标签栏是不能隐藏的，但是可以通过修改userChrome.css文件来实现。

1. 设置

about:config中设置：toolkit.legacyUserProfileCustomizations.stylesheets为true

2. 创建userChrome.css文件，打开帮助->故障排除信息->点击配置文件夹，进入配置文件夹，创建chrome文件夹，创建userChrome.css文件

```css
#main-window:not([drawtitle="true"]):not([inFullscreen="true"]) 

#nav-bar { 
    margin-left : 30px;  /* leftTop drag area */
    border-right: 140px solid var(--toolbar-bgcolor); 
}
:root[sizemode="maximized"] #nav-bar { 
    margin-top: 10px !important;   /* Top drag area */
    margin-left : 0px !important;  /* hidden leftTop drag area in Fullscreen mode*/
    border-right: 140px solid var(--toolbar-bgcolor); 
}
:root[privatebrowsingmode="temporary"] #nav-bar { 
    border-right: 180px solid var(--toolbar-bgcolor) !important; 
}

/* move down to hidden titlebar */
#titlebar {
    margin-bottom: -45px !important;
}

/* move down 3 button on rightTop */
.titlebar-buttonbox-container {
  margin-bottom: -5px !important;
}
:root[sizemode="maximized"] .titlebar-buttonbox-container {
  margin-bottom: -15px !important;
}

/* move down private icon */
.private-browsing-indicator {
  margin-bottom: -8px !important;
}
:root[sizemode="maximized"] .private-browsing-indicator {
  margin-bottom: -18px !important;
}

/* hidden horizontal tabbar on top */
#tabbrowser-tabs[orient="horizontal"] {
    visibility: collapse !important;
}

#sidebar-box[sidebarcommand="_0ad88674-2b41-4cfb-99e3-e206c74a0076_-sidebar-action"] 
sidebarheader { 
    visibility: collapse !important; 
}

```






