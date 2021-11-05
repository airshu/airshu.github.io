---
title: app_bar
toc: true
tags: Flutter
---



```dart

AppBar({
Key? key,
this.leading,
this.automaticallyImplyLeading = true,
this.title,
this.actions,
this.flexibleSpace,
this.bottom,
this.elevation,
this.shadowColor,
this.shape,
this.backgroundColor,
this.foregroundColor,
@Deprecated(
  'This property is no longer used, please use systemOverlayStyle instead. '
  'This feature was deprecated after v2.4.0-0.0.pre.',
)
this.brightness,
this.iconTheme,
this.actionsIconTheme,
@Deprecated(
  'This property is no longer used, please use toolbarTextStyle and titleTextStyle instead. '
  'This feature was deprecated after v2.4.0-0.0.pre.',
)
this.textTheme,
this.primary = true,
this.centerTitle,
this.excludeHeaderSemantics = false,
this.titleSpacing,
this.toolbarOpacity = 1.0,
this.bottomOpacity = 1.0,
this.toolbarHeight,
this.leadingWidth,
@Deprecated(
  'This property is obsolete and is false by default. '
  'This feature was deprecated after v2.4.0-0.0.pre.',
)
this.backwardsCompatibility,
this.toolbarTextStyle,
this.titleTextStyle,
this.systemOverlayStyle,
})
```


```dart
SliverAppBar({
  //在标题左侧显示的一个控件，在首页通常显示应用的 logo；在其他界面通常显示为返回按钮
  this.leading,
  this.automaticallyImplyLeading = true,
  this.title,
  this.actions,//一个 Widget 列表，代表 Toolbar 中所显示的菜单，对于常用的菜单，通常使用 IconButton 来表示；对于不常用的菜单通常使用 PopupMenuButton 来显示为三个点，点击后弹出二级菜单
  this.flexibleSpace,
  this.bottom,//一个 AppBarBottomWidget 对象，用来在 Toolbar 标题下面显示一个Widget。
  this.elevation,
  this.shadowColor,
  this.forceElevated = false,
  this.backgroundColor, //APP bar 的颜色
  this.foregroundColor, 
  this.brightness, //App bar 的亮度，有白色和黑色两种主题，默认值为 ThemeData.primaryColorBrightness
  this.iconTheme,
  this.actionsIconTheme,
  this.textTheme,
  this.primary = true,//此应用栏是否显示在屏幕顶部
  this.centerTitle,//标题是否居中显示，默认值根据不同的操作系统，显示方式不一样,true居中 false居左
  this.excludeHeaderSemantics = false,
  this.titleSpacing,//标题是否居中显示，默认值根据不同的操作系统，显示方式不一样,true居中 false居左
  this.collapsedHeight,//收缩的最小高度
  this.expandedHeight,//展开高度
  this.floating = false,//是否随着滑动隐藏标题
  this.pinned = false,//SliverAppBar收缩到最小高度的时候SliverAppBar是否可见
  this.snap = false,//SliverAppBar收缩到最小高度的时候SliverAppBar是否可见。SliverAppBar收缩到最小高度的时候SliverAppBar是否可见
  this.stretch = false,//SliverAppBar完全展开后是否可以继续拉伸，注意这个需要外部滑动组件physics的支持（设置BouncingScrollPhysics()，滑动到标界可以继续滑动拥有回弹效果），否则是不会生效的
  this.stretchTriggerOffset = 100.0,
  this.onStretchTrigger,
  this.shape,
  this.toolbarHeight = kToolbarHeight,
  this.leadingWidth,
  this.backwardsCompatibility,
  this.toolbarTextStyle,
  this.titleTextStyle,
  this.systemOverlayStyle,
});

```



## 参考

- [https://github.com/yechaoa/flutter_sliverappbar](https://github.com/yechaoa/flutter_sliverappbar)