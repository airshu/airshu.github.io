---
title: RecyclerView之Adapter
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


Adapter是RecyclerView的第一个内部类，将RecyclerView和视图关联起来。使用的是很方便的，只要继承它，重写几个方法即可。


```java

//创建视图
public RecyclerView.ViewHolder onCreateViewHolder(ViewGroup parent, int viewType)

//将视图跟当前位置的数据绑定
public void onBindViewHolder(RecyclerView.ViewHolder holder, int position)

//返回元素的个数
public int getItemCount()

//设置类型，用于缓存策略中
public int getItemViewType(int position) {
    return 0;
}

```


## Adapter

视图模型中，我们只需要改变数据，并发送通知，系统会自动更新UI。

Adapter内部有一个AdapterDataObservable，继承自Java的Observable，使用观察者模式。RecyclerView中RecyclerViewDataObserver进行监听，
最终使用AdapterHelper进行操作。

- notifyItemChanged(int position) 更新列表position位置上的数据可以调用
- notifyItemInserted(int position) 列表position位置添加一条数据时可以调用，伴有动画效果
- notifyItemRemoved(int position) 列表position位置移除一条数据时调用，伴有动画效果
- notifyItemMoved(int fromPosition, int toPosition) 列表fromPosition位置的数据移到toPosition位置时调用，伴有动画效果
- notifyItemRangeChanged(int positionStart, int itemCount) 列表从positionStart位置到itemCount数量的列表项进行数据刷新
- notifyItemRangeInserted(int positionStart, int itemCount) 列表从positionStart位置到itemCount数量的列表项批量添加数据时调用，伴有动画效果
- notifyItemRangeRemoved(int positionStart, int itemCount) 列表从positionStart位置到itemCount数量的列表项批量删除数据时调用，伴有动画效果
- notifyDataSetChanged



## ApaterHelper


管理和执行更新操作的帮助类，RecyclerView将每一次更新操作封装成了一个UpdateOp操作，然后通过AdapterHelper进行管理和执行。

当RecyclerView初始化时，会创建AdapterHelper，然后通过实现的dispatchUpdate方法，最终调用布局管理器进行元素的操作。

它内部有一个静态内部类UpdateOp，定义了相应的操作指令：

```java

final class AdapterHelper implements OpReorderer.Callback {

//UpdateOp对象的回收和复用
private Pools.Pool<UpdateOp> mUpdateOpPool = new Pools.SimplePool<UpdateOp>(UpdateOp.POOL_SIZE);
//将要执行的操作列表
final ArrayList<UpdateOp> mPendingUpdates = new ArrayList<UpdateOp>();
//需要延迟执行的操作列表
final ArrayList<UpdateOp> mPostponedList = new ArrayList<UpdateOp>();

//指令操作的记录器
// since move operations breaks continuity, their effects on ADD/RM are hard to handle.
// we push them to the end of the list so that they can be handled easily.
final OpReorderer mOpReorderer;


    static final class UpdateOp {
    
        static final int ADD = 1;
        static final int REMOVE = 1 << 1;
        static final int UPDATE = 1 << 2;
        static final int MOVE = 1 << 3;
        static final int POOL_SIZE = 30;
        
        ...
        
    }

}


```


### preProcess

当滑动RecyclerView等原因造成数据改变时，会触发到preProcess方法

```java

void preProcess() {
    //添加到记录器中
    mOpReorderer.reorderOps(mPendingUpdates);
    final int count = mPendingUpdates.size();
    //将待处理队列中的指令进行处理
    for (int i = 0; i < count; i++) {
        UpdateOp op = mPendingUpdates.get(i);
        switch (op.cmd) {
            case UpdateOp.ADD:
            //通过回调到RecyclerView中，找到对应ViewHolder，修改相应数值，比如mPosition
                applyAdd(op);
                break;
            case UpdateOp.REMOVE:
                applyRemove(op);
                break;
            case UpdateOp.UPDATE:
                applyUpdate(op);
                break;
            case UpdateOp.MOVE:
                applyMove(op);
                break;
        }
        if (mOnItemProcessedCallback != null) {
            mOnItemProcessedCallback.run();
        }
    }
    //清空列表
    mPendingUpdates.clear();
}

```


## 参考

- [https://fsilence.github.io/2020/05/15/RecyclerView-AdapterHelper](https://fsilence.github.io/2020/05/15/RecyclerView-AdapterHelper)
