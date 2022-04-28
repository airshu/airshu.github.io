---
title: Element
toc: true
tags: Flutter
---


## 概念

Widget是UI元素的配置数据，Element代表屏幕显示元素。主要作用：

- 维护这棵Element Tree，根据Widget Tree的变化来更新Element Tree，包括：节点的插入、更新、删除、移动等；
- 将Widget和RenderObject关联到Element Tree上。

![](./element_1.png)

- ComponentElement：用来组合其他更基础的Element，开发时常用到的StatelessWidget和StatefulWidget相对应的Element：StatelessElement和StatefulElement。
- RenderObjectElement：渲染类Element，对应Renderer Widget，是框架最核心的Element。RenderObjectElement主要包括LeafRenderObjectElement，SingleChildRenderObjectElement，和MultiChildRenderObjectElement。其中，LeafRenderObjectElement对应的Widget是LeafRenderObjectWidget，没有子节点；SingleChildRenderObjectElement对应的Widget是SingleChildRenderObjectWidget，有一个子节点；MultiChildRenderObjectElement对应的Widget是MultiChildRenderObjecWidget，有多个子节点。



## 生命周期


Element有4种状态：initial，active，inactive，defunct。其对应的意义如下：

- initial：初始状态，Element刚创建时就是该状态。、
- active：激活状态。此时Element的Parent已经通过mount将该Element插入Element Tree的指定的插槽处（Slot），Element此时随时可能显示在屏幕上。
- inactive：未激活状态。当Widget Tree发生变化，Element对应的Widget发生变化，同时由于新旧Widget的Key或者的RunTimeType不匹配等原因导致该Element也被移除，因此该Element的状态变为未激活状态，被从屏幕上移除。并将该Element从Element Tree中移除，如果该Element有对应的RenderObject，还会将对应的RenderObject从Render Tree移除。但是，此Element还是有被复用的机会，例如通过GlobalKey进行复用。
- defunct：失效状态。如果一个处于未激活状态的Element在当前帧动画结束时还是未被复用，此时会调用该Element的unmount函数，将Element的状态改为defunct，并对其中的资源进行清理。

![](./element_2.png)

## ComponentElement


### 创建

![](./element_3.png)

### 更新

![](./element_4.png)

### 销毁

![](./element_5.png)


## RenderObjectElement


### 创建

![](./element_3.png)

### 更新

![](./element_4.png)

### 销毁

![](./element_5.png)



## 参考
