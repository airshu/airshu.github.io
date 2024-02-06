---
title: Flutter事件分发原理
toc: true
tags: Flutter
---

Flutter中，Android设备上的事件分发流程：

Android的事件响应，通过Engine发送到framework层，Flutter侧的GestureBinding负责接收事件。

Flutter侧对设备事件定义了touch、mouse、stylus、invertedStylus、trackpad、unknown几种类型


![](./event_dispatch_0.png)


![](./event_dispatch_1.png)

1. 命中测试：当手指按下时，触发 PointerDownEvent 事件，按照深度优先遍历当前渲染（render object）树，对每一个渲染对象进行“命中测试”（hit test），如果命中测试通过，则该渲染对象会被添加到一个 HitTestResult 列表当中。
2. 事件分发：命中测试完毕后，会遍历 HitTestResult 列表，调用每一个渲染对象的事件处理方法（handleEvent）来处理 PointerDownEvent 事件，该过程称为“事件分发”（event dispatch）。随后当手指移动时，便会分发 PointerMoveEvent 事件。
3. 事件清理：当手指抬（ PointerUpEvent ）起或事件取消时（PointerCancelEvent），会先对相应的事件进行分发，分发完毕后会清空 HitTestResult 列表。


## Flutter屏幕触发的事件类型

- PointerAddedEvent：接触屏幕
- PointerHoverEvent：悬停事件
- PointerDownEvent：按下事件
- PointerMoveEvent：移动事件
- PointerUpEvent：完全离开屏幕事件
- PointerCancelEvent：取消事件
- PointerRemovedEvent：事件可能已偏离设备的检测范围，或者可能已完全与系统断开连接



## 事件流程


Dart层中手势事件从_dispatchPointerDataPacket开始，之后会执行GestureBinding的_handlePointerEvent方法。

```dart
  void handlePointerEvent(PointerEvent event) {

    if (resamplingEnabled) {
      _resampler.addOrDispatch(event);
      _resampler.sample(samplingOffset, _samplingClock);
      return;
    }

    // Stop resampler if resampling is not enabled. This is a no-op if
    // resampling was never enabled.
    _resampler.stop();
    _handlePointerEventImmediately(event);
  }

  void _handlePointerEventImmediately(PointerEvent event) {
    HitTestResult? hitTestResult;
    if (event is PointerDownEvent || event is PointerSignalEvent || event is PointerHoverEvent || event is PointerPanZoomStartEvent) {
      hitTestResult = HitTestResult();
      //开始碰撞检测 先调用RenderBinding中的 再调用GestureBinding中的
      hitTest(hitTestResult, event.position);
      if (event is PointerDownEvent || event is PointerPanZoomStartEvent) {
        _hitTests[event.pointer] = hitTestResult;
      }
    } else if (event is PointerUpEvent || event is PointerCancelEvent || event is PointerPanZoomEndEvent) {
      //复用机制，抬起或取消，不用hitTest，移除
      hitTestResult = _hitTests.remove(event.pointer);
    } else if (event.down || event is PointerPanZoomUpdateEvent) {
      hitTestResult = _hitTests[event.pointer];
    }
    if (hitTestResult != null ||
        event is PointerAddedEvent ||
        event is PointerRemovedEvent) {
          //分发事件
      dispatchEvent(event, hitTestResult);
    }
  }

```

### RenderBinding的hitTest

```dart

  void hitTest(HitTestResult result, Offset position) {
    //RenderView
    renderView.hitTest(result, position: position);
    super.hitTest(result, position);
  }



/// RenderView中的hitTest
  bool hitTest(HitTestResult result, { required Offset position }) {
    //RenderBox
    if (child != null) {
      child!.hitTest(BoxHitTestResult.wrap(result), position: position);
    }
    result.add(HitTestEntry(this));
    return true;
  }

/// RenderObject中的hitTest
  bool hitTest(BoxHitTestResult result, { required Offset position }) {
    if (_size!.contains(position)) {
      if (hitTestChildren(result, position: position) || hitTestSelf(position)) {
        result.add(BoxHitTestEntry(this, position));
        return true;
      }
    }
    return false;
  }
```

### GestureBinding的hitTest

```dart
  void hitTest(HitTestResult result, Offset position) {
    result.add(HitTestEntry(this));
  }
```


### 分发事件

dispatchEvent对事件进行分发

```dart

  void dispatchEvent(PointerEvent event, HitTestResult? hitTestResult) {
    if (hitTestResult == null) {
      assert(event is PointerAddedEvent || event is PointerRemovedEvent);
      try {
        // 没有碰撞检测信息
        pointerRouter.route(event);
      } catch (exception, stack) {
      }
      return;
    }
    for (final HitTestEntry entry in hitTestResult.path) {
      try {
        // 存在碰撞时，每个控件内部调用handleEvent处理，多个控件存在竞争时如何处理？ 使用手势竞技场GestureArenaManager
        entry.target.handleEvent(event.transformed(entry.transform), entry);
      } catch (exception, stack) {
      }
    }
  }


```



## 手势竞技场GestureArenaManager

- GestureRecognizer ：手势识别器基类，基本上 RenderPointerListener 中需要处理的手势事件，都会分发到它对应的 GestureRecognizer，并经过它处理和竞技后再分发出去，常见有 ：
  - OneSequenceGestureRecognizer
  - MultiTapGestureRecognizer
  - HorizontalDragGestureRecognizer
  - VerticalDragGestureRecognizer
  - TapGestureRecognizer、
  - LongPressGestureRecognizer
  - DoubleTapGestureRecognizer
  - PanGestureRecognizer
  - ScaleGestureRecognizer
  - ForcePressGestureRecognizer
- GestureArenaManager：手势竞技管理，它管理了整个“战争”的过程，原则上竞技胜出的条件是 ：第一个竞技获胜的成员或最后一个不被拒绝的成员。
- GestureArenaEntry ：提供手势事件竞技信息的实体，内封装参与事件竞技的成员。
- GestureArenaMember：参与竞技的成员抽象对象，内部有 acceptGesture 和 rejectGesture 方法，它代表手势竞技的成员，默认 GestureRecognizer 都实现了它，所有竞技的成员可以理解为就是 GestureRecognizer 之间的竞争。
- _GestureArena：GestureArenaManager 内的竞技场，内部持参与竞技的 members 列表，官方对这个竞技场的解释是： 如果一个手势试图在竞技场开放时(isOpen=true)获胜，它将成为一个带有“渴望获胜”的属性的对象。当竞技场关闭(isOpen=false)时，竞技场将寻找一个“渴望获胜”的对象成为新的参与者，如果这时候刚好只有一个，那这一个参与者将成为这次竞技场胜利的青睐存在。

### 添加到竞技场

![](./arena_1.webp)

手势识别器是如何添加到竞技场的呢？

1. 使用GestureDector，在其build方法中会根据不同的场景注册不同的手势识别器，将其传递给RawGestureDetector
2. RawGestureDetector的build方法中创建Listener，并通过_handlePointerDown方法将PointerDownEvent数据添加进来
3. GestureBinding的handleEvent中竞技场处理数据

```dart

  void handleEvent(PointerEvent event, HitTestEntry entry) {
    //使用注册的识别器GestureRecognizer的handleEvent处理
    //比如TapGestureRecognizer中，在其父类PrimaryPointerGestureRecognizer的handleEvent中处理
    pointerRouter.route(event);
    if (event is PointerDownEvent || event is PointerPanZoomStartEvent) {
      //关闭手势竞技场，并尝试解决手势竞技场
      gestureArena.close(event.pointer);
    } else if (event is PointerUpEvent || event is PointerPanZoomEndEvent) {
      //扫描手势竞技场，并调用第一个手势识别器的 acceptGesture 方法
      gestureArena.sweep(event.pointer);
    } else if (event is PointerSignalEvent) {
      pointerSignalResolver.resolve(event);
    }
  }


```

### 竞技场处理

GestureArenaManager的作用：

1. 存储所有竞技场及竞技场成员的添加及移除。
2. 竞技场状态的管理。如竞技场的创建、关闭、生命周期的延长等。
3. 每个竞技场中成员竞争的具体实现。




## 参考

- [Flutter事件机制](https://book.flutterchina.club/chapter8/hittest.html)
- [浅谈Flutter核心机制之---事件分发](https://blog.51cto.com/jdsjlzx/5528350)
- [Flutter分享：Flutter事件分发原理](https://juejin.cn/post/7016621342103437349)
- [全面深入触摸和滑动原理](https://wizardforcel.gitbooks.io/gsyflutterbook/content/Flutter-13.html)
- [Flutter之竞技场（Arena）原理解析](https://juejin.cn/post/6874570159768633357)