---
title: RecyclerView之缓存策略
toc: true
tags: [Android, RecyclerView]
---


## 概述




## Recycler



```java

public final class Recycler {

    // 未与RecyclerView分离的ViewHolder列表
    // 如果仍依赖于 RecyclerView （比如已经滑动出可视范围，但还没有被移除掉），但已经被标记移除的 ItemView 集合会被添加到 mAttachedScrap 中 
    final ArrayList<ViewHolder> mAttachedScrap = new ArrayList<>();
    
    ArrayList<ViewHolder> mChangedScrap = null;

    final ArrayList<ViewHolder> mCachedViews = new ArrayList<ViewHolder>();

    private final List<ViewHolder>
            mUnmodifiableAttachedScrap = Collections.unmodifiableList(mAttachedScrap);

    private int mRequestedCacheMax = DEFAULT_CACHE_SIZE;
    int mViewCacheMax = DEFAULT_CACHE_SIZE;

    // 缓存池，业务场景中可复用的ViewHolder可以存储进来
    RecycledViewPool mRecyclerPool;

    private ViewCacheExtension mViewCacheExtension;

    static final int DEFAULT_CACHE_SIZE = 2;

    // 将view对应的ViewHolder移动到mCachedViews中；如果View是scrapped状态，会先unscrap
    public void recycleView(@NonNull View view) {}    
    
    // 从mChangedScrap、mAttachedScrap、mCachedViews、ViewCacheExtension、RecycledViewPool中进行匹配；若匹配不了，
    // 最后会直接调用Adapter.createViewHolder方法进行创建
    ViewHolder tryGetViewHolderForPositionByDeadline(int position,
                boolean dryRun, long deadlineNs) {
                
    }
    
    //从 attach scrap、hidden children 、 cache中，根据 position 返回 ViewHolder
    ViewHolder getScrapOrHiddenOrCachedHolderForPosition(int position, boolean dryRun) {
    
    }
}

```

### 缓存类型

- mAttachedScrap、mChangedScrap

    - mAttachedScrap保存依附于 RecyclerView 的 ViewHolder。包含移出屏幕但未从 RecyclerView 移除的 ViewHolder。
    - mChangedScrap 保存数据发生改变的 ViewHolder，即调用 notifyDataSetChanged() 等系列方法后需要更新的 ViewHolder。

- mCachedViews

    - mCachedViews 用于解决滑动抖动的问题，默认容量为2。

- ViewCacheExtension

    开发者自定义的缓存
  
- RecyclerViewPool

    缓存池，可以在多个RecyclerView中共享ViewHolder。通过setMaxRecycledViews设置对应type的ViewHolder的缓存池大小


### 获取VH流程

![](./RecyclerView_cache_level.png)


### RecyclerViewPool

**缓存池的用法：**

```kotlin
var linearLayoutManager = LinearLayoutManager(activity)
linearLayoutManager.recycleChildrenOnDetach = true
recyclerView.layoutManager = linearLayoutManager
//设置缓存大小
recycledViewPool.setMaxRecycledViews(0, 10)
//共用缓存池
recyclerView.setRecycledViewPool(recycledViewPool)
```




## 参考

- [https://phantomvk.github.io/2019/02/13/RecyclerView_cache/](https://phantomvk.github.io/2019/02/13/RecyclerView_cache/)
