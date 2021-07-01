---
title: 自定义View
date: 2021-06-01
toc: true
tags:
---


## 需要注意的点

### 让View支持wrap_content

这是因为直接继承View或者ViewGroup的控件，如果不在onMeasure中对wrap_content做特殊处理，那么当外界在布局中使用wrap_content时就无法达到预期的效果

### 如果有必要，让你的View支持padding


这是因为直接继承View的控件，如果不在draw方法中处理padding，那么padding属性是无法起作用的。另外，直接继承自ViewGroup的控件需要在onMeasure和onLayout中考
虑padding和子元素的margin对其造成的影响，不然将导致padding和子元素的margin失效。

### 尽量不要在View中使用Handler，没必要

这是因为View内部本身就提供了post系列的方法，完全可以替代Handler的作用，当然除非你很明确地要使用Handler来发送消息。

### View中如果有线程或者动画，需要及时停止，参考View#onDetachedFromWindow

如果有线程或者动画需要停止时，那么onDetachedFromWindow是一个很好的时机。当包含此View的Activity退出或者当前View被remove时，View的 onDetachedFromWindow方法会被调用，
和此方法对应的是onAttachedToWindow，当包含此View的Activity启动时，View的onAttachedToWindow方法会被调用。同时，当View变得
不可见时我们也需要停止线程和动画，如果不及时处理这种问题，有可能会造成内存泄漏。

### View带有滑动嵌套情形时，需要处理好滑动冲突

## 参考

- 《Android开发艺术探索》 


