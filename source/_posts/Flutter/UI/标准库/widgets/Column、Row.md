---
title: Column、Row
toc: true
tags: Flutter
---

![](./rowalignment.png)


## 常用属性

###  MainAxisSize

主轴的可用空间大小

- min:主轴上可以分配的最小空间，由子元素的布局约束决定
- max:主轴上可以分配的最大空间

###  mainAxisAlignment

主轴，对于行，水平是主轴；对于列，竖直是主轴。

假设TextDirection是ltr（文字从左向右读）

- start: 居左
- end：居右
- center：居中
- spaceBetween:将主轴方向上的空白区域均分，使得children之间的空白区域相等，首尾child都靠近首尾，没有间隙；
- spaceAround：将主轴方向上的空白区域均分，使得子元素之间的空白区域相等，但是首尾child的空白区域为1/2
- spaceEvenly：将主轴方向上的空白区域均分，使得children之间的空白区域相等，包括首尾child；


### crossAxisAlignment

交叉轴，对于行，竖直方向是交叉轴；对于列，水平方向是交叉轴。

假设VerticalDirection是down

- start: 居上
- end：居下
- center：居中
- stretch：让children填满竖轴方向
- baseline：使得children的baseline对齐，在对齐文字时候比较游泳。尤其是一行中有不同大小的文字，那么可以使用baseline对齐.


