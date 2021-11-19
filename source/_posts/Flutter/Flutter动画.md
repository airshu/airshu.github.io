---
title: Flutter动画
toc: true
tags: Flutter
---


https://flutter.cn/docs/development/ui/animations


Implicit Animations

ImplicitlyAnimatedWidget的子类，可以方便的设置各种各种属性的动画。

- AnimatedContainer
- AnimatedAlign
- AnimatedOpacity
- AnimatedPositioned
- AnimatedRotation
- AnimatedScale
- AnimatedSlide

常用属性：
duration	设置动画时长
curve	设置动画曲线
onEnd	动画结束回调



Explicit Animations


- FadeTransition
- SizeTransition
- SlideTransition



AnimatedSwitcher
AnimatedWidget


Staggered Animations
交织动画


动画的基本概念和类

Animation存储动画的值

AnimationController管理Animation

CurvedAnimation定义非线性动画

Tween为动画差一个范围值


AnimationController controller = AnimationController(
    duration: const Duration(milliseconds: 500), vsync: this);
Animation<int> alpha = IntTween(begin: 0, end: 255).animate(controller);

