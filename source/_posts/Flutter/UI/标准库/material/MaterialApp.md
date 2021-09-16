---
title: MaterialApp
toc: true
tags: Flutter
---


## 常用属性

### GlobalKey<NavigatorState> navigatorKey

类型，导航键

### final RouteFactory? onGenerateRoute

生成路由的回调函数，当导航的命名路由的时候，会使用这个来生成界面。

### final RouteFactory? onUnknownRoute;

未知路由

### final String? initialRoute;

初始路由，默认值为 Window.defaultRouteName。

app运行后进入的初始路由，如果没有设置，则进入home。


### final TransitionBuilder? builder;

建造者

### final String title;

在任务管理窗口中所显示的应用名字

### final GenerateAppTitle? onGenerateTitle;

生成标题

### final Color? color;

应用的主要颜色值（primary color），也就是安卓任务管理窗口中所显示的应用颜色

### final Locale? locale;

本地化

### final Iterable<LocalizationsDelegate<dynamic>>? localizationsDelegates;

本地化委托

### final Iterable<Locale> supportedLocales;

支持本地化列表

### final Widget? home;

应用默认所显示的界面 Widget。

home是默认根路由，也就是'/' routes是路由表. 如果没有home，那么routes中要有“/”路由（Navigator.defaultRouteName）

### final Map<String, WidgetBuilder>? routes;

应用的顶级导航表格

### final bool debugShowMaterialGrid;

是否显示 纸墨设计 基础布局网格，用来调试 UI 的工具


### theme:ThemeData

主题设置
