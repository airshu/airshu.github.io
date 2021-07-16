---
title: RecyclerView之ItemDecoration
toc: true
tags: [Android, RecyclerView]
---


## 概述

ItemDecoration用于在每个元素之间设置视图，比如分割线。它是一个抽象类，我们在使用过程中，只需要实现相应的方法，就能进行视图的大小设置，内容绘制。


## 方法介绍

```java


//重写绘制方法，画自己想要的内容
public void onDraw(@NonNull Canvas c, @NonNull RecyclerView parent) {
}

//这个方法会在onDraw后面执行
public void onDrawOver(@NonNull Canvas c, @NonNull RecyclerView parent,
        @NonNull State state) {
    onDrawOver(c, parent);
}

//指定尺寸
public void getItemOffsets(@NonNull Rect outRect, @NonNull View view,
        @NonNull RecyclerView parent, @NonNull State state) {
    getItemOffsets(outRect, ((LayoutParams) view.getLayoutParams()).getViewLayoutPosition(),
            parent);
}

```

## 参考

- [https://www.jianshu.com/p/6a093bcc6b83](https://www.jianshu.com/p/6a093bcc6b83)
