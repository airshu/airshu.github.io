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
- layer：
- isRepaintBoundary：绘制边界点，单独的一层渲染，提升性能
- needsCompositing：

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


## 布局


### 布局过程：

1. 父节点向子节点传递约束（constraints）信息，限制子节点的最大和最小宽高。
2. 子节点根据约束信息确定自己的大小。
3. 父节点根据特定布局规则确定每一个子节点在父节点布局控件中的位置，用偏移offset表示。
4. 递归整个过程，确定出每一个节点的大小和位置。




### layout流程

1. 确定当前组件的布局边界。
2. 判断是否需要重新布局，如果没必要会直接返回，反之才需要重新布局。不需要布局要同时满足以下三个条件：
    1. 当前组件没有被标记为需要重新布局。
    2. 父组件传递的约束没有发生变化。
    3. 当前组件的布局边界没有发生变化。
3. 调用performLayout进行布局，其内部会调用子组件的layout方法。
4. 请求绘制。

### performLayout流程：

1. 如果有子组件，则对子组件进行递归布局。
2. 确定当前组件的大小，通常会依赖子组件的大小。
3. 确定子组件在当前组件中的起始偏移。


```dart

void layout(Constraints constraints, { bool parentUsesSize = false }) {
  RenderObject? relayoutBoundary;
  // 先确定当前组件的布局边界
  if (!parentUsesSize || sizedByParent || constraints.isTight || parent is! RenderObject) {
    relayoutBoundary = this;
  } else {
    relayoutBoundary = (parent! as RenderObject)._relayoutBoundary;
  }
  // _needsLayout 表示当前组件是否被标记为需要布局
  // _constraints 是上次布局时父组件传递给当前组件的约束
  // _relayoutBoundary 为上次布局时当前组件的布局边界
  // 所以，当当前组件没有被标记为需要重新布局，且父组件传递的约束没有发生变化，
  // 且布局边界也没有发生变化时则不需要重新布局，直接返回即可。
  if (!_needsLayout && constraints == _constraints && relayoutBoundary == _relayoutBoundary) {
    return;
  }
  // 如果需要布局，缓存约束和布局边界
  _constraints = constraints;
  _relayoutBoundary = relayoutBoundary;

  // 后面解释
  if (sizedByParent) {
    performResize();
  }
  // 执行布局
  performLayout();
  // 布局结束后将 _needsLayout 置为 false
  _needsLayout = false;
  // 将当前组件标记为需要重绘（因为布局发生变化后，需要重新绘制）
  markNeedsPaint();
}

```



## 绘制


**大致流程：**

第一次绘制时，从上到下递归绘制子节点，每当遇到一个边界节点，判断如果该节点的layer属性是否为空，是就创建一个新的OffsetLayer并赋值给它；不是则使用。然后将layer传递给子节点，接下来：

1. 如果子节点是非边界节点，且需要绘制，则：
    - 第一次绘制：创建一个Canvas对象和一个PictureLayer，然后将它们绑定，后续调用Canvas绘制都会落到和其绑定的PictureLayer上，接着这个PictureLayer会加入到边界节点的layer中；
    - 不是第一次绘制：复用已有的边界节点和Canvas对象；
2. 如果子节点是边界节点，则对子节点递归上述过程。当子树递归完成后，就要将子节点的layer添加到父级layer中。 


RenderObject调用markNeedsRepaint来发起重绘：

1. 从当前节点一直往父级查找，直到找到一个**绘制边界点**时终止查找，然后会将该绘制边界点添加到其PiplineOwner的_nodesNeedingPaint列表中。
2. 在查找的过程中，会将自己到绘制边界点路径上所有节点的_needPaint属性设置为true，表示需要重绘。
3. 请求新的frame，执行重绘流程。下一个frame就会走drawFrame流程，涉及到flushCompositingBits、flushPaint 和 compositeFrame 三个函数。

```dart

void markNeedsPaint() {
  if (_needsPaint) return;
  _needsPaint = true;
  if (isRepaintBoundary) { // 如果是当前节点是边界节点
      owner!._nodesNeedingPaint.add(this); //将当前节点添加到需要重新绘制的列表中。
      owner!.requestVisualUpdate(); // 请求新的frame，该方法最终会调用scheduleFrame()
  } else if (parent is RenderObject) { // 若不是边界节点且存在父节点
    final RenderObject parent = this.parent! as RenderObject;
    parent.markNeedsPaint(); // 递归调用父节点的markNeedsPaint
  } else {
    // 如果是根节点，直接请求新的 frame 即可
    if (owner != null)
      owner!.requestVisualUpdate();
  }
}


```


## 命中测试

命中测试用来判断某个组件是否需要响应一个点击事件，其入口是RenderObject Tree的根节点RenderView的hitTest函数

```dart
bool hitTest(HitTestResult result, { Offset position }) {
  if (child != null)
    child.hitTest(BoxHitTestResult.wrap(result), position: position);//child为RenderView
  result.add(HitTestEntry(this));
  return true;
}
```

查看RenderView源码

```dart
bool hitTest(BoxHitTestResult result, { @required Offset position }) {
  if (_size.contains(position)) {
    if (hitTestChildren(result, position: position) || hitTestSelf(position)) {
      result.add(BoxHitTestEntry(this, position));
      return true;
    }
  }
  return false;
}
```

如果点击事件位置处于RenderObject之内，如果在其内，并且hitTestSelf或者hitTestChildren返回true，则表示RenderObject通过了命中测试，需要响应事件，此时需要将被点击的RenderObject加入BoxHitTestResult列表，同时点击事件不再向下传递。否则认为没有通过命中测试，事件继续向下传递。其中，hitTestSelf函数表示节点是否通过命中测试，hitTestChildren表示子节点是否通过命中测试。
