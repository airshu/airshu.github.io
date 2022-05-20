---
title: InheritedWidget
toc: true
tags: Flutter
---



## 基本用法


提供一种在widget树中从上到下共享数据的方式。


## 核心函数


### updateShouldNotify

控制依赖于InheritedWidget的组件是否需要重建。如果为true，则当InheritedWidget发生变化时，依赖于它的组件会被rebuild，其Element的didChangeDependencies会被调用。


## 源码分析

Element中，_inheritedWidgets保存了所有上级节点的InheritedElement。

```dart
Map<Type, InheritedElement>? _inheritedWidgets;
/// Element中
void _updateInheritance() {
  assert(_lifecycleState == _ElementLifecycle.active);
  _inheritedWidgets = _parent?._inheritedWidgets;
}

/// InheritedElement中
void _updateInheritance() {
  assert(_lifecycleState == _ElementLifecycle.active);
  final Map<Type, InheritedElement>? incomingWidgets = _parent?._inheritedWidgets;
  if (incomingWidgets != null)
    _inheritedWidgets = HashMap<Type, InheritedElement>.of(incomingWidgets);
  else
    _inheritedWidgets = HashMap<Type, InheritedElement>();
  _inheritedWidgets![widget.runtimeType] = this;
}
```



获取InheritedWidget的方式

```dart
  T? dependOnInheritedWidgetOfExactType<T extends InheritedWidget>({Object? aspect}) {
    assert(_debugCheckStateIsActiveForAncestorLookup());
    final InheritedElement? ancestor = _inheritedWidgets == null ? null : _inheritedWidgets![T];
    if (ancestor != null) {
      return dependOnInheritedElement(ancestor, aspect: aspect) as T;
    }
    _hadUnsatisfiedDependencies = true;
    return null;
  }

  InheritedElement? getElementForInheritedWidgetOfExactType<T extends InheritedWidget>() {
    assert(_debugCheckStateIsActiveForAncestorLookup());
    final InheritedElement? ancestor = _inheritedWidgets == null ? null : _inheritedWidgets![T];
    return ancestor;
  }

```

从根节点到子节点，以runtimeType作为key，保存最新的Element对象。getElementForInheritedWidgetOfExactType方法可以通过类型查找离自己最近的类型的对象。
dependOnInheritedWidgetOfExactType方法会注册依赖，当InheritedWidget发生变化时就会更新依赖它的子组件。