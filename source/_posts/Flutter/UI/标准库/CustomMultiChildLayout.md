---
title: CustomMultiChildLayout
toc: true
tags: Flutter
---

CustomMultiChildLayout从字面意思就说的很清楚了，自定义多个孩子的布局控件

## 基本用法

```dart

CustomMultiChildLayout(
  delegate: XXXDelegate(dataList), //委托 用于设置child的大小和位置
  children: dataList.map((e) => LayoutId(id: e['id'], child: const _FigureBlock())).toList(), //视图 对应每个child显示的样子
)

class _FigureBlock extends StatelessWidget {

}


class XXXDelegate extends MultiChildLayoutDelegate {

  XXXDelegate(this.dataList);
  List dataList;
  /// 处理大小和位置
  @override
  void performLayout(Size size) {
    for (var element in dataList) {
      String id = element['id'];
      Rect rect = element['rect'];

      // 约束对应id的child的消息
      layoutChild(id, BoxConstraints(maxHeight: rect.height, maxWidth: size.width));
      // 对应id的child的位置
      positionChild(id, Offset(rect.left, rect.top));
    }
  }

  /// 是否需要重新布局
  @override
  bool shouldRelayout(_BlockEventMultiChildLayoutDelegate oldDelegate) {
    return oldDelegate.dataList != dataList;
  }

}


```

