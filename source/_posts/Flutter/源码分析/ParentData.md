---
title: ParentData
toc: true
tags: Flutter
---

## 概念



RenderObject有一个parentData插槽（slot）用于存储父节点的一些信息，这个插槽，就是预留一个接口或位置，由其他对象来接入或占据。

![](./parentdata_1.png)

## BoxParentData

```dart
/// Parent data used by [RenderBox] and its subclasses.
class BoxParentData extends ParentData {
  /// The offset at which to paint the child in the parent's coordinate system.
  Offset offset = Offset.zero;

  @override
  String toString() => 'offset=$offset';
}
```

BoxParentData用于RenderBox，对应普通视图场景。offset属性用于描述子节点在父节点中的坐标偏移，主要用于子节点的布局。



## BoxParentData关键流程

通过了解RenderObject，我们知道它的作用是布局、绘制、点击测试。BoxParentData的offset，在子RenderObject节点的setupParentData进行初始化，在performLayout中对offset进行赋值，在paint函数中使用offset确认子节点的绘制位置，在hitTestChildren中使用offset辅助判断是否在点击区域内。
