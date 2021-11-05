---
title: tabs
toc: true
tags: Flutter
---


## 概述

TabBar：Tab页的选项组件，默认为水平排列。

TabBarView：Tab页的内容容器，Tab页内容一般处理为随选项卡的改变而改变。

TabController：TabBar和TabBarView的控制器，它是关联这两个组件的桥梁。


## TabBarView


```dart
  const TabBar({
    Key? key,
    required this.tabs,//一系列标签控件
    this.controller,//一系列标签控件
    this.isScrollable = false,//是否可滚动，默认false
    this.padding,
    this.indicatorColor,//是否可滚动，默认false
    this.automaticIndicatorColorAdjustment = true,
    this.indicatorWeight = 2.0,//是否可滚动，默认false
    this.indicatorPadding = EdgeInsets.zero,
    this.indicator,//是否可滚动，默认false
    this.indicatorSize,//指示器长短，tab：和tab一样长，label：和标签label 一样长
    this.labelColor,//标签颜色
    this.labelStyle,//标签颜色
    this.labelPadding,//标签颜色
    this.unselectedLabelColor,//标签颜色
    this.unselectedLabelStyle,//标签颜色
    this.dragStartBehavior = DragStartBehavior.start,
    this.overlayColor,
    this.mouseCursor,
    this.enableFeedback,
    this.onTap,
    this.physics,
	indicator, //自定义指示器，比如使用UnderlineTabIndicator
  })

```

**如何隐藏指示器**

```
//设置指示器为没有视图的Widget
indicator: const BoxDecoration(),
```