---
title: RecyclerView之绘制流程
toc: true
tags: [Android, RecyclerView]
---



## 绘制流程



### onMeasure



先概括下onMeasure的大致流程：

1. LayoutManager对象为空,RecyclerView不能显示任何的数据。
2. LayoutManager开启了自动测量时，在这种情况下，有可能会测量两次。
3. LayoutManager没有开启自动测量的情况，这种情况比较少，因为为了RecyclerView支持warp_content属性，系统提供的LayoutManager都开启自动测量的



测量的状态保存在State中，有以下几种状态：

值 | 描述
--- | ---
State.STEP_START | mState.mLayoutStep 的默认值，这种情况下，表示 RecyclerView 还未经历 dispatchLayoutStep1，因为 dispatchLayoutStep1 调用之后mState.mLayoutStep 会变为 State.STEP_LAYOUT。
State.STEP_LAYOUT | 当 mState.mLayoutStep 为 State.STEP_LAYOUT 时，表示此时处于 layout 阶段，这个阶段会调用 dispatchLayoutStep2 方法 layout RecyclerView 的children。调用 dispatchLayoutStep2 方法之后，此时 mState.mLayoutStep 变为了 State.STEP_ANIMATIONS。
State.STEP_ANIMATIONS | 当 mState.mLayoutStep为 State.STEP_ANIMATIONS 时，表示 RecyclerView 处于第三个阶段，也就是执行动画的阶段，也就是调用 dispatchLayoutStep3方法。当 dispatchLayoutStep3 方法执行完毕之后，mState.mLayoutStep 又变为了 State.STEP_START。


```java
@Override
protected void onMeasure(int widthSpec, int heightSpec) {
    //当布局管理器为空时，进行默认的测量。RecyclerView不能显示任何的数据
    if (mLayout == null) {
        defaultOnMeasure(widthSpec, heightSpec);
        return;
    }
    //自动测量
    if (mLayout.isAutoMeasureEnabled()) {
        
        mLayout.onMeasure(mRecycler, mState, widthSpec, heightSpec);
        // 开始测量
        if (mState.mLayoutStep == State.STEP_START) {
            dispatchLayoutStep1();
        }
        
        mLayout.setMeasureSpecs(widthSpec, heightSpec);
        
        mState.mIsMeasuring = true;
        //测量的第二步，更新子布局
        dispatchLayoutStep2();
        
        //如果rclerview没有精确的宽度和高度，并且至少有一个子View
        //子View也没有精确的宽度和高度，我们必须重新测量。
        if (mLayout.shouldMeasureTwice()) {
            mLayout.setMeasureSpecs(
                    MeasureSpec.makeMeasureSpec(getMeasuredWidth(), MeasureSpec.EXACTLY),
                    MeasureSpec.makeMeasureSpec(getMeasuredHeight(), MeasureSpec.EXACTLY));
            mState.mIsMeasuring = true;
            dispatchLayoutStep2();
            // now we can get the width and height from the children.
            mLayout.setMeasuredDimensionFromChildren(widthSpec, heightSpec);
        }
        
        
    } else {
        //是否使用固定尺寸
        if (mHasFixedSize) {
            mLayout.onMeasure(mRecycler, mState, widthSpec, heightSpec);
            return;
        }
        //
        if (mAdapterUpdateDuringMeasure) {
            processAdapterUpdatesAndSetAnimationFlags();
        } else if (mState.mRunPredictiveAnimations) {
            setMeasuredDimension(getMeasuredWidth(), getMeasuredHeight());
            return;
        }
        
        mLayout.onMeasure(mRecycler, mState, widthSpec, heightSpec);

    
    }
    
}

/**
 * - 处理 Adapter 更新
 * - 决定执行哪一种动画
 * - 保存每个 ItemView 的信息
 * - 有必要的话，会进行预布局，并把相关信息保存下来
 */
private void dispatchLayoutStep1() {
    mState.assertLayoutStep(State.STEP_START);
    fillRemainingScrollValues(mState);
    mState.mIsMeasuring = false;
    startInterceptRequestLayout();
    mViewInfoStore.clear();
    onEnterLayoutOrScroll();
    
    processAdapterUpdatesAndSetAnimationFlags();
    saveFocusInfo();
    mState.mTrackOldChangeHolders = mState.mRunSimpleAnimations && mItemsChanged;
    mItemsAddedOrRemoved = mItemsChanged = false;
    // 是否预布局
    mState.mInPreLayout = mState.mRunPredictiveAnimations;
    mState.mItemCount = mAdapter.getItemCount();
    findMinMaxChildLayoutPositions(mMinMaxLayoutPositions);

    if (mState.mRunSimpleAnimations) {
        // Step 0: Find out where all non-removed items are, pre-layout
        int count = mChildHelper.getChildCount();
        for (int i = 0; i < count; ++i) {
            //根据当前的显示在界面上的ViewHolder的布局信息创建一个ItemHolderInfo
            final ViewHolder holder = getChildViewHolderInt(mChildHelper.getChildAt(i));
            if (holder.shouldIgnore() || (holder.isInvalid() && !mAdapter.hasStableIds())) {
                continue;
            }
            // 记录当前的位置信息 Left、Right、Top、Bottom等
            final ItemHolderInfo animationInfo = mItemAnimator
                    .recordPreLayoutInformation(mState, holder,
                            ItemAnimator.buildAdapterChangeFlagsForAnimations(holder),
                            holder.getUnmodifiedPayloads());
            //把 holder对应的animationInfo保存到 mViewInfoStore中
            mViewInfoStore.addToPreLayout(holder, animationInfo);
            if (mState.mTrackOldChangeHolders && holder.isUpdated() && !holder.isRemoved()
                    && !holder.shouldIgnore() && !holder.isInvalid()) {
                long key = getChangedHolderKey(holder);
                mViewInfoStore.addToOldChangeHolders(key, holder);
            }
        }
    }
    if (mState.mRunPredictiveAnimations) {
        saveOldPositions();
        final boolean didStructureChange = mState.mStructureChanged;
        mState.mStructureChanged = false;
        // temporarily disable flag because we are asking for previous layout
        //在layoutmanager中进行测量
        mLayout.onLayoutChildren(mRecycler, mState);
        mState.mStructureChanged = didStructureChange;

        for (int i = 0; i < mChildHelper.getChildCount(); ++i) {
            final View child = mChildHelper.getChildAt(i);
            final ViewHolder viewHolder = getChildViewHolderInt(child);
            if (viewHolder.shouldIgnore()) {
                continue;
            }
            if (!mViewInfoStore.isInPreLayout(viewHolder)) {
                int flags = ItemAnimator.buildAdapterChangeFlagsForAnimations(viewHolder);
                boolean wasHidden = viewHolder
                        .hasAnyOfTheFlags(ViewHolder.FLAG_BOUNCED_FROM_HIDDEN_LIST);
                if (!wasHidden) {
                    flags |= ItemAnimator.FLAG_APPEARED_IN_PRE_LAYOUT;
                }
                final ItemHolderInfo animationInfo = mItemAnimator.recordPreLayoutInformation(
                        mState, viewHolder, flags, viewHolder.getUnmodifiedPayloads());
                if (wasHidden) {
                    recordAnimationInfoIfBouncedHiddenView(viewHolder, animationInfo);
                } else {
                    mViewInfoStore.addToAppearedInPreLayoutHolders(viewHolder, animationInfo);
                }
            }
        }
        // we don't process disappearing list because they may re-appear in post layout pass.
        clearOldPositions();
    } else {
        clearOldPositions();
    }
    onExitLayoutOrScroll();
    stopInterceptRequestLayout(false);
    //设置状态
    mState.mLayoutStep = State.STEP_LAYOUT;
}  

/**
 * 第二步，我们会真正的测量视图。
 * 这一步可能执行多次
 */
private void dispatchLayoutStep2() {
    startInterceptRequestLayout();
    onEnterLayoutOrScroll();
    mState.assertLayoutStep(State.STEP_LAYOUT | State.STEP_ANIMATIONS);
    mAdapterHelper.consumeUpdatesInOnePass();
    
    mState.mItemCount = mAdapter.getItemCount();//返回元素个数
    mState.mDeletedInvisibleItemCountSincePreviousLayout = 0;
    if (mPendingSavedState != null && mAdapter.canRestoreState()) {
        if (mPendingSavedState.mLayoutState != null) {
            mLayout.onRestoreInstanceState(mPendingSavedState.mLayoutState);
        }
        mPendingSavedState = null;
    }
    // Step 2: Run layout
    // 更改此状态，确保不是会执行上一布局操作
    mState.mInPreLayout = false;
    //LayoutManager中进行子视图测量
    //子视图的测量通用具体的布局管理器实现
    mLayout.onLayoutChildren(mRecycler, mState);

    mState.mStructureChanged = false;

    // onLayoutChildren may have caused client code to disable item animations; re-check
    mState.mRunSimpleAnimations = mState.mRunSimpleAnimations && mItemAnimator != null;
    //设置状态
    mState.mLayoutStep = State.STEP_ANIMATIONS;
    onExitLayoutOrScroll();
    stopInterceptRequestLayout(false);
}
      
```


我们看看LinearLayoutManager是如何测量的

```java

public void onLayoutChildren(RecyclerView.Recycler recycler, RecyclerView.State state) {
    //布局算法
    // 1)通过检查子变量和其他变量，找到一个锚坐标和一个锚物品的位置。
    // 2)开始填充，从底部开始堆叠
    // 3)向底填充，从上往下堆叠
    // 4)从底部滚动以满足堆栈等需求。创建布局状态
    // 解决布局方向
    resolveShouldLayoutReverse();
    final View focused = getFocusedChild();
    if (!mAnchorInfo.mValid || mPendingScrollPosition != RecyclerView.NO_POSITION
            || mPendingSavedState != null) {
        mAnchorInfo.reset();
        mAnchorInfo.mLayoutFromEnd = mShouldReverseLayout ^ mStackFromEnd;
        // calculate anchor position and coordinate
        // 计算锚点位置和坐标
        updateAnchorInfoForLayout(recycler, state, mAnchorInfo);
        mAnchorInfo.mValid = true;
    } else if (focused != null && (mOrientationHelper.getDecoratedStart(focused)
            >= mOrientationHelper.getEndAfterPadding()
            || mOrientationHelper.getDecoratedEnd(focused)
            <= mOrientationHelper.getStartAfterPadding())) {
        // This case relates to when the anchor child is the focused view and due to layout
        // shrinking the focused view fell outside the viewport, e.g. when soft keyboard shows
        // up after tapping an EditText which shrinks RV causing the focused view (The tapped
        // EditText which is the anchor child) to get kicked out of the screen. Will update the
        // anchor coordinate in order to make sure that the focused view is laid out. Otherwise,
        // the available space in layoutState will be calculated as negative preventing the
        // focused view from being laid out in fill.
        // Note that we won't update the anchor position between layout passes (refer to
        // TestResizingRelayoutWithAutoMeasure), which happens if we were to call
        // updateAnchorInfoForLayout for an anchor that's not the focused view (e.g. a reference
        // child which can change between layout passes).
        mAnchorInfo.assignFromViewAndKeepVisibleRect(focused, getPosition(focused));
    }
    
    if (mAnchorInfo.mLayoutFromEnd) {
        updateLayoutStateToFillStart(mAnchorInfo);
        mLayoutState.mExtraFillSpace = extraForStart;
        fill(recycler, mLayoutState, state, false);
    } else {
       fill(recycler, mLayoutState, state, false);
    }
    
}


int fill(RecyclerView.Recycler recycler, LayoutState layoutState,
        RecyclerView.State state, boolean stopOnFocusable) {
 
    while ((layoutState.mInfinite || remainingSpace > 0) && layoutState.hasMore(state)) {
            layoutChunkResult.resetInternal();
            if (RecyclerView.VERBOSE_TRACING) {
                TraceCompat.beginSection("LLM LayoutChunk");
            }
            //填充item
            layoutChunk(recycler, state, layoutState, layoutChunkResult);      
            
    } 
}

/**
1. 调用layoutState.next(recycler)获取View
2. addView
3. measureChildWithMargins进行子View测量
*/
void layoutChunk(RecyclerView.Recycler recycler, RecyclerView.State state,
        LayoutState layoutState, LayoutChunkResult result) {

    View view = layoutState.next(recycler);
    
    LayoutParams params = (LayoutParams) view.getLayoutParams();
        if (layoutState.mScrapList == null) {
            if (mShouldReverseLayout == (layoutState.mLayoutDirection
                    == LayoutState.LAYOUT_START)) {
                //添加item的视图
                addView(view);
            } else {
                addView(view, 0);
            }
        } else {
            if (mShouldReverseLayout == (layoutState.mLayoutDirection == LayoutState.LAYOUT_START)) {
                addDisappearingView(view);
            } else {
                addDisappearingView(view, 0);
            }
        }
        // 测量view
        measureChildWithMargins(view, 0, 0);
       ...
}
    

```

流程图如下：

![](./measure.png)



### onLayout


```java

@Override
protected void onLayout(boolean changed, int l, int t, int r, int b) {
    TraceCompat.beginSection(TRACE_ON_LAYOUT_TAG);
    dispatchLayout();
    TraceCompat.endSection();
    mFirstLayoutComplete = true;
}

void dispatchLayout() {
    //这个时候测量已经结束
    mState.mIsMeasuring = false;
    if (mState.mLayoutStep == State.STEP_START) {
        //当还是测量初始状态时，走上面的测量流程
        dispatchLayoutStep1();
        mLayout.setExactMeasureSpecsFrom(this);
        dispatchLayoutStep2();
    } else if (mAdapterHelper.hasUpdates()
            || needsRemeasureDueToExactSkip
            || mLayout.getWidth() != getWidth()
            || mLayout.getHeight() != getHeight()) {
        // First 2 steps are done in onMeasure but looks like we have to run again due to
        // changed size.
        // 数据更新、改变尺寸后需要重新测量
        mLayout.setExactMeasureSpecsFrom(this);
        dispatchLayoutStep2();
    } else {
        // always make sure we sync them (to ensure mode is exact)
        // 确保跟布局管理器同步
        mLayout.setExactMeasureSpecsFrom(this);
    }
    dispatchLayoutStep3();    
}

/**
布局的最后一步，我们保存关于视图的动画信息，
触发动画并进行必要的清理
*/
private void dispatchLayoutStep3() {

    //恢复默认值
    mState.mLayoutStep = State.STEP_START;
    //如果有动画
    if (mState.mRunSimpleAnimations) {
        // Step 3: Find out where things are now, and process change animations.
        // traverse list in reverse because we may call animateChange in the loop which may
        // remove the target view holder.
        // 遍历子元素
        for (int i = mChildHelper.getChildCount() - 1; i >= 0; i--) {
            // 拿到VH
            ViewHolder holder = getChildViewHolderInt(mChildHelper.getChildAt(i));
            if (holder.shouldIgnore()) {
                continue;
            }
            long key = getChangedHolderKey(holder);
            final ItemHolderInfo animationInfo = mItemAnimator
                    .recordPostLayoutInformation(mState, holder);
            ViewHolder oldChangeViewHolder = mViewInfoStore.getFromOldChangeHolders(key);
            if (oldChangeViewHolder != null && !oldChangeViewHolder.shouldIgnore()) {
                // run a change animation
    
                // If an Item is CHANGED but the updated version is disappearing, it creates
                // a conflicting case.
                // Since a view that is marked as disappearing is likely to be going out of
                // bounds, we run a change animation. Both views will be cleaned automatically
                // once their animations finish.
                // On the other hand, if it is the same view holder instance, we run a
                // disappearing animation instead because we are not going to rebind the updated
                // VH unless it is enforced by the layout manager.
                final boolean oldDisappearing = mViewInfoStore.isDisappearing(
                        oldChangeViewHolder);
                final boolean newDisappearing = mViewInfoStore.isDisappearing(holder);
                if (oldDisappearing && oldChangeViewHolder == holder) {
                    // run disappear animation instead of change
                    mViewInfoStore.addToPostLayout(holder, animationInfo);
                } else {
                    final ItemHolderInfo preInfo = mViewInfoStore.popFromPreLayout(
                            oldChangeViewHolder);
                    // we add and remove so that any post info is merged.
                    mViewInfoStore.addToPostLayout(holder, animationInfo);
                    ItemHolderInfo postInfo = mViewInfoStore.popFromPostLayout(holder);
                    if (preInfo == null) {
                        handleMissingPreInfoForChangeError(key, holder, oldChangeViewHolder);
                    } else {
                        // 添加新的视图
                        // 添加到ChildHelper上
                        animateChange(oldChangeViewHolder, holder, preInfo, postInfo,
                                oldDisappearing, newDisappearing);
                    }
                }
            } else {
                mViewInfoStore.addToPostLayout(holder, animationInfo);
            }
        }

        // Step 4: Process view info lists and trigger animations
        // 处理列表的视图信息和触发动画
        mViewInfoStore.process(mViewInfoProcessCallback);
    }

    mLayout.removeAndRecycleScrapInt(mRecycler);
    mState.mPreviousLayoutItemCount = mState.mItemCount;
    mDataSetHasChangedAfterLayout = false;
    mDispatchItemsChangedEvent = false;
    mState.mRunSimpleAnimations = false;
    
    mState.mRunPredictiveAnimations = false;
    mLayout.mRequestedSimpleAnimations = false;
    if (mRecycler.mChangedScrap != null) {
        mRecycler.mChangedScrap.clear();
    }
    if (mLayout.mPrefetchMaxObservedInInitialPrefetch) {
        // Initial prefetch has expanded cache, so reset until next prefetch.
        // This prevents initial prefetches from expanding the cache permanently.
        mLayout.mPrefetchMaxCountObserved = 0;
        mLayout.mPrefetchMaxObservedInInitialPrefetch = false;
        mRecycler.updateViewCacheSize();
    }
    //回到布局管理器，同步状态
    mLayout.onLayoutCompleted(mState);
    onExitLayoutOrScroll();
    stopInterceptRequestLayout(false);
    mViewInfoStore.clear();
    if (didChildRangeChange(mMinMaxLayoutPositions[0], mMinMaxLayoutPositions[1])) {
        dispatchOnScrolled(0, 0);
    }
    recoverFocusFromState();
    resetFocusInfo();
}



private void animateChange(@NonNull ViewHolder oldHolder, @NonNull ViewHolder newHolder,
            @NonNull ItemHolderInfo preInfo, @NonNull ItemHolderInfo postInfo,
            boolean oldHolderDisappearing, boolean newHolderDisappearing) {

    if (oldHolder != newHolder) {
        if (newHolderDisappearing) {
            addAnimatingView(newHolder);
        }
        oldHolder.mShadowedHolder = newHolder;
        // old holder should disappear after animation ends
        //添加视图到管理器
        addAnimatingView(oldHolder);
        mRecycler.unscrapView(oldHolder);
        newHolder.setIsRecyclable(false);
        newHolder.mShadowingHolder = oldHolder;
    }

    //启动动画
    if (mItemAnimator.animateChange(oldHolder, newHolder, preInfo, postInfo)) {
        postAnimationRunner();
    }            
}

```

主要的工作内容如下：

1. 检查状态，如果是STEP_START，则先测量；
2. 数据、尺寸发生变化，则走dispatchLayoutStep2；
3. 处理需要播放动画的数据
4. 状态同步给布局管理器




### onDraw

```java

public void onDraw(Canvas c) {
    super.onDraw(c);

    final int count = mItemDecorations.size();
    // 遍历隔间装饰列表，进行绘制。
    // 子视图在自己的onDraw中绘制
    for (int i = 0; i < count; i++) {
        mItemDecorations.get(i).onDraw(c, this, mState);
    }
}
```

## 参考

