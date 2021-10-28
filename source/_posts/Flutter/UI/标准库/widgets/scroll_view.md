---
title: scroll_view
toc: true
tags: Flutter
---

## ListView

```
ListView{
itemExtent //强制限制高度
}
```




## CustomScrollView

slivers

- 如果不是Sliver家族的Widget，需要使用SliverToBoxAdapter做层包裹

### 注意点

- 当列表项高度固定时，使用 SliverFixedExtendList 比 SliverList 具有更高的性能




## GridView


```dart
  GridView.builder(
      gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(//可以直接指定每行（列）显示多少个Item
        crossAxisCount: 3,//一行的Widget数量
        crossAxisSpacing: 5.0, //水平间距
        mainAxisSpacing: 5.0, //垂直间距
        childAspectRatio: 1.0,//子Widget宽高比例
      ),
      padding: EdgeInsets.all(10.0),//GridView内边距
      itemCount: _dataArr.length, // 元素个数
      //单元格样式
      itemBuilder: (context, index) {
        return item(_dataArr,index,context);
      }
  )
```