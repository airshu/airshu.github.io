---
title: RecyclerView之SnapHelper
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




## 概要

SnapHelper用于辅助RecyclerView在滚动结束时将Item对齐到某个位置。能让RecyclerView实现类似ViewPager等功能。

RecyclerView描述滚动状态的几个属性：

- `SCROLL_STATE_IDLE`：滚动闲置状态，此时并没有手指滑动或者动画执行
- `SCROLL_STATE_DRAGGING`：滚动拖拽状态，由于用户触摸屏幕产生
- `SCROLL_STATE_SETTLING`：自动滚动状态，此时没有手指触摸，一般是由动画执行滚动到最终位置，包括smoothScrollTo等方法的调用

当手指在屏幕上滑动RecyclerView然后松手，RecyclerView中的内容会顺着惯性继续往手指滑动的方向继续滚动直到停止，这个过程叫做`Fling`。

## Fling

当触发MotionEvent.ACTION_UP时，RecyclerView会进行fling判断。

```java

public boolean fling(int velocityX, int velocityY) {
    if (mLayout == null) {
        Log.e(TAG, "Cannot fling without a LayoutManager set. "
                + "Call setLayoutManager with a non-null argument.");
        return false;
    }
    if (mLayoutFrozen) {
        return false;
    }

    final boolean canScrollHorizontal = mLayout.canScrollHorizontally();
    final boolean canScrollVertical = mLayout.canScrollVertically();

    if (!canScrollHorizontal || Math.abs(velocityX) < mMinFlingVelocity) {
        velocityX = 0;
    }
    if (!canScrollVertical || Math.abs(velocityY) < mMinFlingVelocity) {
        velocityY = 0;
    }
    if (velocityX == 0 && velocityY == 0) {
        // If we don't have any velocity, return false
        return false;
    }

    //处理嵌套滚动PreFling
    if (!dispatchNestedPreFling(velocityX, velocityY)) {
        final View firstChild = mLayout.getChildAt(0);
        final View lastChild = mLayout.getChildAt(mLayout.getChildCount() - 1);
        boolean consumed = false;
        if (velocityY < 0) {
            consumed = getChildAdapterPosition(firstChild) > 0
                    || firstChild.getTop() < getPaddingTop();
        }

        if (velocityY > 0) {
            consumed = getChildAdapterPosition(lastChild) < mAdapter.getItemCount() - 1
                    || lastChild.getBottom() > getHeight() - getPaddingBottom();
        }

        dispatchNestedFling(velocityX, velocityY, consumed);

        //通过setOnFlingListener设置mOnFlingListener，由用户来判断是否属性自己定义fling行为
        //默认的实现有LinearSnapHelper、PagerSnapHelper
        if (mOnFlingListener != null && mOnFlingListener.onFling(velocityX, velocityY)) {
            return true;
        }

        final boolean canScroll = canScrollHorizontal || canScrollVertical;

        if (canScroll) {
            velocityX = Math.max(-mMaxFlingVelocity, Math.min(velocityX, mMaxFlingVelocity));
            velocityY = Math.max(-mMaxFlingVelocity, Math.min(velocityY, mMaxFlingVelocity));
            /默认的Fling操作，最终到OverScroller计算滚动相关的值
            mViewFlinger.fling(velocityX, velocityY);
            return true;
        }
    }
    return false;
}

```

由源码可知，会来到SnapHelper进行判断。

## SnapHelper

SnapHelper是一个抽象类，具体实现有LinearSnapHelper、PagerSnapHelper。


```java

/**
会计算第二个参数对应的ItemView当前的坐标与需要对齐的坐标之间的距离。该方法返回一个大小为2的int数组，分别对应x轴和y轴方向上的距离。
*/
public abstract int[] calculateDistanceToFinalSnap(@NonNull RecyclerView.LayoutManager layoutManager,
        @NonNull View targetView);


/**
会找到当前layoutManager上最接近对齐位置的那个view，该view称为SanpView，对应的position称为SnapPosition。如果返回null，
就表示没有需要对齐的View，也就不会做滚动对齐调整。
*/
public abstract View findSnapView(RecyclerView.LayoutManager layoutManager);


/**
会根据触发Fling操作的速率（参数velocityX和参数velocityY）来找到RecyclerView需要滚动到哪个位置，该位置对应的ItemView就是那个需要
进行对齐的列表项。我们把这个位置称为targetSnapPosition，对应的View称为targetSnapView。如果找不到targetSnapPosition，就返回
RecyclerView.NO_POSITION
*/
public abstract int findTargetSnapPosition(RecyclerView.LayoutManager layoutManager, int velocityX, int velocityY);



```

通过下面的代码，注册到RecyclerView中，可以实现相应的效果。

```java
//滚动停止时相应的Item停留中间位置
new LinearSnapHelper().attachToRecyclerView(mRecyclerView);

//类似ViewPage效果
new PagerSnapHelper().attachToRecyclerView(mRecyclerView);
```


来看看LinearSnapHelper的源码

### 依附RecyclerView流程

```java

public void attachToRecyclerView(@Nullable RecyclerView recyclerView)
        throws IllegalStateException {
    //如果SnapHelper之前已经附着到此RecyclerView上，不用进行任何操作
    if (mRecyclerView == recyclerView) {
        return; // nothing to do
    }
    //如果SnapHelper之前附着的RecyclerView和现在的不一致，清理掉之前RecyclerView的回调
    if (mRecyclerView != null) {
        destroyCallbacks();
    }
    mRecyclerView = recyclerView;
    if (mRecyclerView != null) {
        //设置当前RecyclerView对象的回调
        setupCallbacks();
        //创建一个Scroller对象，用于辅助计算fling的总距离
        mGravityScroller = new Scroller(mRecyclerView.getContext(),
                new DecelerateInterpolator());
        //调用snapToTargetExistingView()方法以实现对SnapView的对齐滚动处理
        snapToTargetExistingView();
    }
}

private void setupCallbacks() throws IllegalStateException {
    if (mRecyclerView.getOnFlingListener() != null) {
        throw new IllegalStateException("An instance of OnFlingListener already set.");
    }
    //注册滚动监听器
    mRecyclerView.addOnScrollListener(mScrollListener);
    //注册自己
    mRecyclerView.setOnFlingListener(this);
}


// Handles the snap on scroll case.
private final RecyclerView.OnScrollListener mScrollListener =
        new RecyclerView.OnScrollListener() {
            boolean mScrolled = false;

            @Override
            public void onScrollStateChanged(RecyclerView recyclerView, int newState) {
                super.onScrollStateChanged(recyclerView, newState);
                if (newState == RecyclerView.SCROLL_STATE_IDLE && mScrolled) {
                    mScrolled = false;
                    //对targetView进行滚动调整，以确保停止的位置是在对应的坐标上，这就是RecyclerView添加该OnScrollListener的目的
                    snapToTargetExistingView();
                }
            }

            @Override
            public void onScrolled(RecyclerView recyclerView, int dx, int dy) {
                if (dx != 0 || dy != 0) {
                    mScrolled = true;
                }
            }
        };

void snapToTargetExistingView() {
    if (mRecyclerView == null) {
        return;
    }
    RecyclerView.LayoutManager layoutManager = mRecyclerView.getLayoutManager();
    if (layoutManager == null) {
        return;
    }
    
    //找出SnapView
    View snapView = findSnapView(layoutManager);
    if (snapView == null) {
        return;
    }
    //计算出SnapView需要滚动的距离
    int[] snapDistance = calculateDistanceToFinalSnap(layoutManager, snapView);
    //如果需要滚动的距离不是为0，就调用smoothScrollBy（）使RecyclerView滚动相应的距离
    if (snapDistance[0] != 0 || snapDistance[1] != 0) {
        mRecyclerView.smoothScrollBy(snapDistance[0], snapDistance[1]);
    }
}
```

### onFling

在RecyclerView中的fling方法中，如果依附来LinearSnapHelper，会调用LinearSnapHelper的onFling方法进行判断。

```java

public boolean onFling(int velocityX, int velocityY) {
    RecyclerView.LayoutManager layoutManager = mRecyclerView.getLayoutManager();
    if (layoutManager == null) {
        return false;
    }
    RecyclerView.Adapter adapter = mRecyclerView.getAdapter();
    if (adapter == null) {
        return false;
    }
    //获取RecyclerView要进行fling操作需要的最小速率，
    //只有超过该速率，ItemView才会有足够的动力在手指离开屏幕时继续滚动下去
    int minFlingVelocity = mRecyclerView.getMinFlingVelocity();
    
    //snapFromFling()这个方法，就是通过该方法实现平滑滚动并使得在滚动停止时itemView对齐到目的坐标位置
    return (Math.abs(velocityY) > minFlingVelocity || Math.abs(velocityX) > minFlingVelocity)
            && snapFromFling(layoutManager, velocityX, velocityY);
            
}

private boolean snapFromFling(@NonNull RecyclerView.LayoutManager layoutManager, int velocityX,
        int velocityY) {
    //layoutManager必须实现ScrollVectorProvider接口才能继续往下操作
    if (!(layoutManager instanceof RecyclerView.SmoothScroller.ScrollVectorProvider)) {
        return false;
    }
    
    //创建SmoothScroller对象，是一个平滑滚动器，用于对ItemView进行平滑滚动操作
    //根据速率计算滑动距离
    RecyclerView.SmoothScroller smoothScroller = createScroller(layoutManager);
    if (smoothScroller == null) {
        return false;
    }

    //通过findTargetSnapPosition()方法，以layoutManager和速率作为参数，找到targetSnapPosition
    int targetPosition = findTargetSnapPosition(layoutManager, velocityX, velocityY);
    if (targetPosition == RecyclerView.NO_POSITION) {
        return false;
    }
    //通过setTargetPosition()方法设置滚动器的滚动目标位置
    smoothScroller.setTargetPosition(targetPosition);
    //利用layoutManager启动平滑滚动器，开始滚动到目标位置
    layoutManager.startSmoothScroll(smoothScroller);
    return true;
}


```

## 总结

1. 使用时使用attachToRecyclerView添加依附
2. onFling操作触发的时候首先通过findTargetSnapPosition找到最终需要滚动到的位置，然后启动平滑滚动器滚动到指定位置，
3. 在指定位置找出来后，系统会回调onTargetFound,然后调用calculateDistanceToFinalSnap方法计算targetView需要减速滚动的距离，然后通过Action
   更新给滚动器。
4. 在滚动停止的时候，也就是state变成SCROLL_STATE_IDLE时会调用snapToTargetExistingView，通过findSnapView找到SnapView，然后通过
   calculateDistanceToFinalSnap计算得到滚动的距离，做最后的对齐调整。

## 参考

- [https://www.jianshu.com/p/e54db232df62](https://www.jianshu.com/p/e54db232df62)
- [https://github.com/rubensousa/GravitySnapHelper](https://github.com/rubensousa/GravitySnapHelper)
