---
title: RenderObject
toc: true
tags: Flutter
---


## 概念


RenderObject表示渲染树的一个对象，负责真正的渲染工作，比如基本布局和绘制。但并没有定义子节点模型，也没有定义坐标系统和布局协议。这些功能由其子类实现。

**作用：**

- 布局，从RenderBox开始，对RenderObject Tree从上至下进行布局。
- 绘制，通过Canvas对象，RenderObject可以绘制自身以及其在RenderObject Tree中的子节点。
- 点击测试，RenderObject从上至下传递点击事件，并通过其位置和behavior来控制是否响应点击事件。

插槽（slot）：所谓插槽，就是预留一个接口或位置，由其他对象来接入或占据。

RenderObject拥有一个parent和parentData插槽（slot）：

- parentData：负责存储父节点所需要的子节点的布局信息。该成员只能通过setupParentData方法赋值，RenderObject的子类通过重写该方法将ParentData的子类赋值给parentData，已扩展ParentData功能。
- layout()：布局阶段，父节点会调用子节点的该方法。
- markNeedsLayout()：标记下一个frame重新layout。
- paint()：绘制

### 核心函数比较

|作用|Flutter RenderObject|	Android View|
|---|---|---|
|绘制|	paint()|	draw()/onDraw()|
|布局|	performLayout()/layout()|	measure()/onMeasure(), layout()/onLayout()|
|布局约束|	Constraints|	MeasureSpec|
|布局协议1|	performLayout() 的 Constraints 参数表示父节点对子节点的布局限制	|measure() 的两个参数表示父节点对子节点的布局限制|
|布局协议2|	performLayout() 应调用各子节点的 layout()|	onLayout() 应调用各子节点的 layout()|
|布局参数|	parentData|	mLayoutParams|
|请求布局|	markNeedsLayout()|	requestLayout()|
|请求绘制|	markNeedsPaint()|	invalidate()|
|添加| child	adoptChild()|	addView()|
|移除| child	dropChild()|	removeView()|
|关联到窗口/树|	attach()|	onAttachedToWindow()|
|从窗口/树取消关联|	detach()|	onDetachedFromWindow()|
|获取 parent|	parent|	getParent()|
|触摸事件|	hitTest()|	onTouch()|
|用户输入事件|	handleEvent()|	onKey()|
|旋转事件|	rotate()|	onConfigurationChanged()|



![](./renderobject_1.png)

### RenderObject子类：

- RenderBox：采用2D笛卡尔坐标系中的渲染对象。它实现了一个内在的尺寸调整协议，它允许您在没有完全铺设的情况下测量一个子级，以这样的方式，如果该子级改变了尺寸，父级将再次布置（考虑到子级的新尺寸）。若对坐标系统没有限制，可直接继承它来实现自定义RenderObject。size属性用来保存控件的高宽。其layout是通过在组件树中从上往下传递BoxConstraints对象实现的。
    - performResize()：测量
    - performLayout()：布局
- RenderView：渲染对象的根。它有单独的子级，它必须是一个RenderBox。因此，如果你想在渲染树中有一个自定义的RenderObject子类，你有两种选择：你可能需要替换RenderView本身，或者你需要一个RenderBox作为它的子类。
- RenderAbstractViewport：内部较大的渲染对象的界面。其渲染对象（如RenderViewport）显示其内容的一部分，可以通过ViewportOffset进行控制。
- RenderSliver：在视图中实现滚动效果的渲染对象的基类。RenderViewport有一组子Sliver，每个Sliver依次排列，覆盖过程中的视图。而RenderSliver则控制着Sliver的绘制渲染。

RenderObjectWithChildMixin为只有一个child的RenderObject提供child管理模型，ContainerRenderObjectMixin用于为多个child的RenderObject提供child管理模型。