---
title: RecyclerView之ItemAnimator
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




## 基本用法

ItemAnimator用于对每一个元素进行动画控制，Android中默认的实现为DefaultItemAnimator。在DefaultItemAnimator的删除动画中，会对被删除的
子视图执行透明度1-0的动画，动画结束后，会删除子视图和回收ViewHolder。


```java

recyclerView.setItemAnimator(new DefaultItemAnimator());//默认实现

```


```java

public abstract static class ItemAnimator {
    
    //表示ViewHolder已经更新
    public static final int FLAG_CHANGED = ViewHolder.FLAG_UPDATE;
    
    //表示ViewHolder已经被移除
    public static final int FLAG_REMOVED = ViewHolder.FLAG_REMOVED;
    
    //notifyDataSetChanged已经被调用，ViewHolder已经失效
    public static final int FLAG_INVALIDATED = ViewHolder.FLAG_INVALID;
    
    //ViewHolder已经移动
    public static final int FLAG_MOVED = ViewHolder.FLAG_MOVED;
    
    
    
    private ItemAnimatorListener mListener = null;//回调监听器
    //监听器列表
    private ArrayList<ItemAnimatorFinishedListener> mFinishedListeners =
            new ArrayList<ItemAnimatorFinishedListener>();
    
    //Item移除回调
    public boolean animateRemove(RecyclerView.ViewHolder holder) {
            return false;
        }
    
    //Item添加回调
    public boolean animateAdd(RecyclerView.ViewHolder holder) {
        return false;
    }
    
    
    //用于控制添加，移动更新时，其它Item的动画执行
    public boolean animateMove(RecyclerView.ViewHolder holder, int fromX, int fromY, int toX, int toY) {
        return false;
    }
    
    //Item更新回调，在显式调用notifyItemChanged()或notifyDataSetChanged()时被调用
    public boolean animateChange(RecyclerView.ViewHolder oldHolder, RecyclerView.ViewHolder newHolder, int fromLeft, int fromTop, int toLeft, int toTop) {
        return false;
    }
    
    // 真正控制执行动画的地方
    // RecyclerView动画的执行方式并不是立即执行，而是每帧执行一次，比如两帧之间添加了多个Item，则会将这些将要执行的动画Pending住，
    // 保存在成员变量中，等到下一帧一起执行。该方法执行的前提是前面animateXxx()返回true。
    public void runPendingAnimations() {
    
    }
    
    //停止某个Item的动画
    public void endAnimation(RecyclerView.ViewHolder item) {
    
    }
    
    //停止所有动画
    public void endAnimations() {
    
    }
    
    //是否有Item在运行
    public boolean isRunning() {
        return false;
    }
    
    //当ViewHolder出现在屏幕上时被调用
    public abstract boolean animateAppearance(@NonNull ViewHolder viewHolder,
        @Nullable ItemHolderInfo preLayoutInfo, @NonNull ItemHolderInfo postLayoutInfo);
                
    //当ViewHolder消失在屏幕上时被调用
    public abstract boolean animateDisappearance(@NonNull ViewHolder viewHolder,
            @NonNull ItemHolderInfo preLayoutInfo, @Nullable ItemHolderInfo postLayoutInfo);
    
    //在没调用notifyItemChanged()和notifyDataSetChanged()的情况下布局发生改变时被调用
    public abstract boolean animatePersistence(@NonNull ViewHolder viewHolder,
            @NonNull ItemHolderInfo preLayoutInfo, @NonNull ItemHolderInfo postLayoutInfo);
            

}

```


## DefaultItemAnimator


这是RecyclerView的默认实现，删除动画中，会对被删除的子视图执行透明度1-0的动画，动画结束后，会删除子视图和回收ViewHolder。

```java

public class DefaultItemAnimator extends SimpleItemAnimator {

    private ArrayList<RecyclerView.ViewHolder> mPendingRemovals = new ArrayList<>();//存放下一帧要执行的一系列add动画
    private ArrayList<RecyclerView.ViewHolder> mPendingAdditions = new ArrayList<>();//存放正在执行的一批add动画
    private ArrayList<MoveInfo> mPendingMoves = new ArrayList<>();
    private ArrayList<ChangeInfo> mPendingChanges = new ArrayList<>();

    ArrayList<ArrayList<RecyclerView.ViewHolder>> mAdditionsList = new ArrayList<>();//存放当前正在执行的add动画
    ArrayList<ArrayList<MoveInfo>> mMovesList = new ArrayList<>();
    ArrayList<ArrayList<ChangeInfo>> mChangesList = new ArrayList<>();

    ArrayList<RecyclerView.ViewHolder> mAddAnimations = new ArrayList<>();
    ArrayList<RecyclerView.ViewHolder> mMoveAnimations = new ArrayList<>();
    ArrayList<RecyclerView.ViewHolder> mRemoveAnimations = new ArrayList<>();
    ArrayList<RecyclerView.ViewHolder> mChangeAnimations = new ArrayList<>();

    // 添加动画
    @Override
    public boolean animateAdd(final RecyclerView.ViewHolder holder) {
        //重置动画，设置默认差值器
        resetAnimation(holder);
        //设置默认状态，透明度为0
        holder.itemView.setAlpha(0);
        //添加到待执行列表中
        mPendingAdditions.add(holder);
        return true;
    }
    
    //fromX、fromY表示起始值
    //toX、toY表示目标值
    @Override
    public boolean animateMove(final RecyclerView.ViewHolder holder, int fromX, int fromY,
            int toX, int toY) {
        final View view = holder.itemView;
        //计算出未执行的值
        fromX += (int) holder.itemView.getTranslationX();
        fromY += (int) holder.itemView.getTranslationY();
        resetAnimation(holder);
        int deltaX = toX - fromX;
        int deltaY = toY - fromY;
        if (deltaX == 0 && deltaY == 0) {
            dispatchMoveFinished(holder);
            return false;
        }
        //把Item位移到未操作前的现位置
        if (deltaX != 0) {
            view.setTranslationX(-deltaX);
        }
        if (deltaY != 0) {
            view.setTranslationY(-deltaY);
        }
        mPendingMoves.add(new MoveInfo(holder, fromX, fromY, toX, toY));
        return true;
    }

    @Override
    public void runPendingAnimations() {
        boolean removalsPending = !mPendingRemovals.isEmpty();//判断移除队列是否为空
        boolean movesPending = !mPendingMoves.isEmpty();
        boolean changesPending = !mPendingChanges.isEmpty();
        boolean additionsPending = !mPendingAdditions.isEmpty();
        //如果都为空，则执行返回
        if (!removalsPending && !movesPending && !additionsPending && !changesPending) {
            // nothing to animate
            return;
        }
        // First, remove stuff
        // 先执行移除队列
        for (RecyclerView.ViewHolder holder : mPendingRemovals) {
            animateRemoveImpl(holder);
        }
        mPendingRemovals.clear();
        // Next, move stuff
        // 执行移动队列
        if (movesPending) {
            final ArrayList<MoveInfo> moves = new ArrayList<>();
            moves.addAll(mPendingMoves);
            mMovesList.add(moves);
            mPendingMoves.clear();
            Runnable mover = new Runnable() {
                @Override
                public void run() {
                    for (MoveInfo moveInfo : moves) {
                        animateMoveImpl(moveInfo.holder, moveInfo.fromX, moveInfo.fromY,
                                moveInfo.toX, moveInfo.toY);
                    }
                    moves.clear();
                    mMovesList.remove(moves);
                }
            };
            //是否需要删除动画
            if (removalsPending) {
                View view = moves.get(0).holder.itemView;
                ViewCompat.postOnAnimationDelayed(view, mover, getRemoveDuration());//等待删除动画结束
            } else {
                mover.run();
            }
        }
        // Next, change stuff, to run in parallel with move animations
        // 
        if (changesPending) {
            final ArrayList<ChangeInfo> changes = new ArrayList<>();
            changes.addAll(mPendingChanges);
            mChangesList.add(changes);
            mPendingChanges.clear();
            Runnable changer = new Runnable() {
                @Override
                public void run() {
                    for (ChangeInfo change : changes) {
                        animateChangeImpl(change);
                    }
                    changes.clear();
                    mChangesList.remove(changes);
                }
            };
            if (removalsPending) {
                RecyclerView.ViewHolder holder = changes.get(0).oldHolder;
                ViewCompat.postOnAnimationDelayed(holder.itemView, changer, getRemoveDuration());
            } else {
                changer.run();
            }
        }
        // Next, add stuff
        // 添加动画
        if (additionsPending) {
            final ArrayList<RecyclerView.ViewHolder> additions = new ArrayList<>();
            additions.addAll(mPendingAdditions);
            mAdditionsList.add(additions);
            mPendingAdditions.clear();
            Runnable adder = new Runnable() {
                @Override
                public void run() {
                    for (RecyclerView.ViewHolder holder : additions) {
                        animateAddImpl(holder);
                    }
                    additions.clear();
                    mAdditionsList.remove(additions);
                }
            };
            if (removalsPending || movesPending || changesPending) {
                long removeDuration = removalsPending ? getRemoveDuration() : 0;
                long moveDuration = movesPending ? getMoveDuration() : 0;
                long changeDuration = changesPending ? getChangeDuration() : 0;
                long totalDelay = removeDuration + Math.max(moveDuration, changeDuration);
                View view = additions.get(0).itemView;
                ViewCompat.postOnAnimationDelayed(view, adder, totalDelay);
            } else {
                adder.run();
            }
        }
    }

    @Override
    public boolean animateRemove(final RecyclerView.ViewHolder holder) {
        //清除、移除Item
        resetAnimation(holder);
        //将ViewHolder添加到待移除队列
        mPendingRemovals.add(holder);
        return true;
    }


}
```


## 源码流程

![](./itemanimtor_liucheng.png)





## 自定义ItemAnimator



## 参考

- [https://www.jianshu.com/p/7171ea362513](https://www.jianshu.com/p/7171ea362513)




