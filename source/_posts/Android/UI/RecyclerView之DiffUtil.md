---
title: RecyclerView之DiffUtil
toc: true
tags: [Android, RecyclerView]
---


## 目录

- [RecyclerView之概述](/Android/UI/RecyclerView之概述/)
- [RecyclerView之绘制流程](/Android/UI/RecyclerView之绘制流程/)
- [RecyclerView之Adapter](/Android/UI/RecyclerView之Adapter/)
- [RecyclerView之ItemDecoration](/Android/UI/RecyclerView之ItemDecoration/)
- [RecyclerView之ItemAnimator](/Android/UI/RecyclerView之ItemAnimator/)
- [RecyclerView之DiffUtil](/Android/UI/RecyclerView之DiffUtil/)
- [RecyclerView之缓存策略](/Android/UI/RecyclerView之缓存策略/)




## 概述

使用DiffUtil的原因是替代notifyDataSetChanged，提升性能。

DiffUtil使用的是Eugene Myers的差别算法，这个算法本身不能检查到元素的移动，也就是移动只能被算作先删除、再增加，而DiffUtil是在算法的结果后再
进行一次移动检查。假设在不检测元素移动的情况下，算法的时间复杂度为O(N + D2)，而检测元素移动则复杂度为O(N2)。所以，如果集合本身就已经排好序，
可以不进行移动的检测提升效率。

ListAdapter和AsyncListDiffer中有使用。


## 使用

```java

public void swap(List newList) {
    
    MyDiffCallback callback = new MyDiffCallback(oldList, newList);
    DiffUtil.DiffResult result = DiffUtil.calculateDiff(callback);

    oldList.clear();
    oldList.addAll(newList);
    result.dispatchUpdatesTo(this);
}


```

使用的步骤：

1. 实现DiffUtil.Callback
2. 调用calculateDiff计算不同点
3. dispatchUpdatesTo刷新数据

## 源码分析


```java

public class DiffUtil {

    // 
    public static DiffResult calculateDiff(@NonNull Callback cb) {
        return calculateDiff(cb, true);
    }

    public abstract static class Callback {
    
        // 旧数据集的长度
        public abstract int getOldListSize();
        
        // 新数据集的长度
        public abstract int getNewListSize();
        
        // 判断是否是同一个item
        public abstract boolean areItemsTheSame(int oldItemPosition, int newItemPosition);
        
        // 如果item相同，此方法用于判断是否同一个Item的内容也相同
        public abstract boolean areContentsTheSame(int oldItemPosition, int newItemPosition);
        
        // 如果item相同，内容不同，用 payLoad 记录这个ViewHolder中具体需要更新那个View
        public Object getChangePayload(int oldItemPosition, int newItemPosition) {
            return null;
        }
        
    }
    
    
    public static class DiffResult {
        // 根据diff 数据结果，选择刷新方式
        public void dispatchUpdatesTo(@NonNull ListUpdateCallback updateCallback) {}
        
    }

}

```

过程如下：

1. 实现DiffUtil.Callback接口
2. 新老数据集通过DiffUtil.calculateDiff计算得到DiffUtil.DiffResult 
3. DiffUtil.DiffResult::dispatchUpdatesTo刷新数据


## 参考

- [RecyclerView中DiffUtil的一些注意事项](https://blog.ysy950803.top/2020/01/12/RecyclerView%E4%B8%ADDiffUtil%E7%9A%84%E4%B8%80%E4%BA%9B%E6%B3%A8%E6%84%8F%E4%BA%8B%E9%A1%B9/)
- [https://developer.android.com/reference/androidx/recyclerview/widget/DiffUtil](https://developer.android.com/reference/androidx/recyclerview/widget/DiffUtil)
- [https://github.com/mrmike/DiffUtil-sample](https://github.com/mrmike/DiffUtil-sample)
