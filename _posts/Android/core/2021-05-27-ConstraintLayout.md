---
layout: post
title: ConstraintLayout
category: Android
tags: Android
keywords: Android
description:
---




### layout_constraintLeft_toRightOf的理解


constraintXXX表示约束View自己，XXX分别表示上下左右等位置，toXXXOf表示约束依赖等对象，可以是同级的View，也可以是parent。


### layout_constraintBaseline_toBaselineOf

对于TextView，可以使用基线对齐，这样文字就能对齐了。


### 边距

**不同方位的边距**

- android:layout_marginStart
- android:layout_marginEnd
- android:layout_marginLeft
- android:layout_marginTop
- android:layout_marginRight
- android:layout_marginBottom

**目标View隐藏时，以下属性生效**
- layout_goneMarginStart
- layout_goneMarginEnd
- layout_goneMarginLeft
- layout_goneMarginTop
- layout_goneMarginRight
- layout_goneMarginBottom



水平居中 layout_constraintLeft_toLeftOf & layout_constraintRight_toRightOf
垂直居中 layout_constraintTop_toTopOf & layout_constraintBottom_toBottomOf



layout_constraintHorizontal_bias 水平偏移
layout_constraintVertical_bias 垂直偏移

两个属性的取值范围在0-1。在水平偏移中，0表示最左，1表示最右；在垂直偏移，0表示最上，1表示最下；0.5表示中间。
