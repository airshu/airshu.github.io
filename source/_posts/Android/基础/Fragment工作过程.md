---
title: Fragment工作过程
tags: Android
toc: true
---


## 常见类的介绍

- ActivityThread : 入口类
- Instrumentation : ActivityThread 的得力助手，帮助 ActivityThread 触发 Activity 的生命周期
- MainActivity : 就是上文提到例子中的 MainActivity 类，继承自 Activity
- HostCallbacks : Activity 的内部类，继承自 FragmentHostCallback
- FragmentHostCallback : 持有 Handler、FragmentManagerImpl 等对象的引用，别的对象可以通过持有它的引用间接控制 FragmentManagerImpl 等对象
- FragmentController : Activity 通过控制它间接向 FragmentManagerImpl 发出命令
- FragmentManagerImpl : 继承自 FragmentManager，用来对 Fragment 进行管理，在 FragmentHostCallback 中被初始化
- BackStackRecord : 继承自 FragmentTransation 并实现了 Runnable，每次调用 FragmentManager 对象的 beginTransaction() 方法都会产生一个 BackStackRecord 对象，可以将其理解为对 Fragment 的一系列操作（即事务）
- Op : 每次对 Fragment 的操作都会产生一个 Op 对象，其表示双向链表的一个结点


## 启动流程

根据[Activity工作过程](/Android/基础/Activity工作过程/)可知，启动一个Activity会来到ActivityThreadp的erformLaunchActivity方法。在这个方法中

```java
//ActivityThread
private Activity performLaunchActivity(ActivityClientRecord r, Intent customIntent) {

    activity.attach(appContext, this, getInstrumentation(), r.token,
                        r.ident, app, r.intent, r.activityInfo, title, r.parent,
                        r.embeddedID, r.lastNonConfigurationInstances, config,
                        r.referrer, r.voiceInteractor, window, r.configCallback,
                        r.assistToken);
                        
    ....
    if (r.isPersistable()) {
        mInstrumentation.callActivityOnCreate(activity, r.state, r.persistentState);
    } else {
        mInstrumentation.callActivityOnCreate(activity, r.state);
    }
    
}


//Activity
mFragments.attachHost(null /*parent*/);


//FragmentController
public void attachHost(Fragment parent) {
    mHost.mFragmentManager.attachController(
            mHost, mHost /*container*/, parent);
}

/FragmentManagerImpl
public void attachController(FragmentHostCallback<?> host, FragmentContainer container,
        Fragment parent) {
    if (mHost != null) throw new IllegalStateException("Already attached");
    mHost = host;//FragmentManagerImpl 对象持有了 HostCallbacks 对象的引用
    mContainer = container;
    mParent = parent;
}
```

attach的流程：

`attach--->attachHost--->attachController`

然后是callActivityOnCreate：

```java

//ActivityThread
private Activity performLaunchActivity(ActivityClientRecord r, Intent customIntent) {
    if (r.isPersistable()) {
        mInstrumentation.callActivityOnCreate(activity, r.state, r.persistentState);
    } else {
        mInstrumentation.callActivityOnCreate(activity, r.state);
    }

}


//Instrumentation
public void callActivityOnCreate(Activity activity, Bundle icicle,
        PersistableBundle persistentState) {
    prePerformCreate(activity);
    activity.performCreate(icicle, persistentState);
    postPerformCreate(activity);
}

//Activity
final void performCreate(Bundle icicle, PersistableBundle persistentState) {
    dispatchActivityPreCreated(icicle);
    mCanEnterPictureInPicture = true;
    restoreHasCurrentPermissionRequest(icicle);
    if (persistentState != null) {
        onCreate(icicle, persistentState);
    } else {
        onCreate(icicle);
    }
    writeEventLog(LOG_AM_ON_CREATE_CALLED, "performCreate");
    mActivityTransitionState.readState(icicle);

    mVisibleFromClient = !mWindow.getWindowStyle().getBoolean(
            com.android.internal.R.styleable.Window_windowNoDisplay, false);
    mFragments.dispatchActivityCreated();
    mActivityTransitionState.setEnterActivityOptions(this, getActivityOptions());
    dispatchActivityPostCreated(icicle);
}

//FragmentController
public void dispatchActivityCreated() {
    mHost.mFragmentManager.dispatchActivityCreated();
}

/FragmentManagerImpl
public void dispatchActivityCreated() {
    this.mStateSaved = false;
    this.mStopped = false;
    this.dispatchStateChange(2);
}

/FragmentManagerImpl
void moveToState(int newState, boolean always) {
...
}

```

callActivityOnCreate的流程：

`callActivityOnCreate--->callActivityOnCreate--->performCreate--->dispatchActivityCreated--->moveToState`

![](./fragment_1.jpg)

![](./2.jpg)

## Fragment的操作原理

Fragment的一般操作如下：

```java
fragmentManager = getSupportFragmentManager();
transaction = fragmentManager.beginTransaction();
transaction.replace(R.id.testFragment, fragment);
transaction.addToBackStack(null);
transaction.commit();
```

getSupportFragmentManager方法直接返回FragmentManagerImpl。

beginTransaction方法返回一个BackStackRecord对象，BackStackRecord对象代表一系列对Fragment的操作，即`事务`。

### replace

replace方法如下：

```java
//BackStackRecord
public FragmentTransaction replace(int containerViewId, Fragment fragment,
        @Nullable String tag) {
        //判断容器id是否有效
    if (containerViewId == 0) {
        throw new IllegalArgumentException("Must use non-zero containerViewId");
    }

    doAddOp(containerViewId, fragment, tag, OP_REPLACE);
    return this;
}

private void doAddOp(int containerViewId, Fragment fragment, @Nullable String tag, int opcmd) {
    final Class fragmentClass = fragment.getClass();
    final int modifiers = fragmentClass.getModifiers();
    if (fragmentClass.isAnonymousClass() || !Modifier.isPublic(modifiers)
            || (fragmentClass.isMemberClass() && !Modifier.isStatic(modifiers))) {
        throw new IllegalStateException("Fragment " + fragmentClass.getCanonicalName()
                + " must be a public static class to be  properly recreated from"
                + " instance state.");
    }

    fragment.mFragmentManager = mManager;

    if (tag != null) {
        if (fragment.mTag != null && !tag.equals(fragment.mTag)) {
            throw new IllegalStateException("Can't change tag of fragment "
                    + fragment + ": was " + fragment.mTag
                    + " now " + tag);
        }
        fragment.mTag = tag;
    }

    if (containerViewId != 0) {
        if (containerViewId == View.NO_ID) {
            throw new IllegalArgumentException("Can't add fragment "
                    + fragment + " with tag " + tag + " to container view with no id");
        }
        if (fragment.mFragmentId != 0 && fragment.mFragmentId != containerViewId) {
            throw new IllegalStateException("Can't change container ID of fragment "
                    + fragment + ": was " + fragment.mFragmentId
                    + " now " + containerViewId);
        }
        fragment.mContainerId = fragment.mFragmentId = containerViewId;
    }
    //生成一个节点
    addOp(new Op(opcmd, fragment));
}

void addOp(Op op) {
    mOps.add(op);
    op.enterAnim = mEnterAnim;
    op.exitAnim = mExitAnim;
    op.popEnterAnim = mPopEnterAnim;
    op.popExitAnim = mPopExitAnim;
}
```

replace主要是生成一个双向链表的节点。

### commit

最后就是commit

```java
//BackStackState
int commitInternal(boolean allowStateLoss) {
    if (mCommitted) throw new IllegalStateException("commit already called");
    if (FragmentManagerImpl.DEBUG) {
        Log.v(TAG, "Commit: " + this);
        LogWriter logw = new LogWriter(TAG);
        PrintWriter pw = new PrintWriter(logw);
        dump("  ", null, pw, null);
        pw.close();
    }
    mCommitted = true;
    if (mAddToBackStack) {
        mIndex = mManager.allocBackStackIndex(this);
    } else {
        mIndex = -1;
    }
    mManager.enqueueAction(this, allowStateLoss);
    return mIndex;
}

//FragmentManager

public void enqueueAction(OpGenerator action, boolean allowStateLoss) {
    if (!allowStateLoss) {
        checkStateLoss();
    }
    synchronized (this) {
        if (mDestroyed || mHost == null) {
            if (allowStateLoss) {
                // This FragmentManager isn't attached, so drop the entire transaction.
                return;
            }
            throw new IllegalStateException("Activity has been destroyed");
        }
        if (mPendingActions == null) {
            mPendingActions = new ArrayList<>();
        }
        mPendingActions.add(action);//保存BackStackState
        scheduleCommit();
    }
}

void scheduleCommit() {
    synchronized (this) {
        boolean postponeReady =
                mPostponedTransactions != null && !mPostponedTransactions.isEmpty();
        boolean pendingReady = mPendingActions != null && mPendingActions.size() == 1;
        if (postponeReady || pendingReady) {
            mHost.getHandler().removeCallbacks(mExecCommit);
            mHost.getHandler().post(mExecCommit);
        }
    }
}

Runnable mExecCommit = new Runnable() {
    @Override
    public void run() {
        execPendingActions();
    }
};

public boolean execPendingActions() {
    ensureExecReady(true);

    boolean didSomething = false;
    while (generateOpsForPendingActions(mTmpRecords, mTmpIsPop)) {
        mExecutingActions = true;
        try {
            removeRedundantOperationsAndExecute(mTmpRecords, mTmpIsPop);
        } finally {
            cleanupExec();
        }
        didSomething = true;
    }

    doPendingDeferredStart();
    burpActive();

    return didSomething;
}

private boolean generateOpsForPendingActions(ArrayList<BackStackRecord> records,
        ArrayList<Boolean> isPop) {
    boolean didSomething = false;
    synchronized (this) {
        if (mPendingActions == null || mPendingActions.size() == 0) {
            return false;
        }

        final int numActions = mPendingActions.size();
        for (int i = 0; i < numActions; i++) {
            didSomething |= mPendingActions.get(i).generateOps(records, isPop);//添加到回退栈中
        }
        mPendingActions.clear();
        mHost.getHandler().removeCallbacks(mExecCommit);
    }
    return didSomething;
}

private void removeRedundantOperationsAndExecute(ArrayList<BackStackRecord> records,
        ArrayList<Boolean> isRecordPop) {
 ...
 
 executePostponedTransaction(records, isRecordPop);
 ...
 executeOpsTogether(records, isRecordPop, recordNum, reorderingEnd);
 ...       
}

private void executeOpsTogether(ArrayList<BackStackRecord> records,
        ArrayList<Boolean> isRecordPop, int startIndex, int endIndex) {
 
 ...
        oldPrimaryNav = record.expandOps(mTmpAddedFragments, oldPrimaryNav);//OP_REPLACE会从这里触发
        ...
         executeOps(records, isRecordPop, startIndex, endIndex);//Run the operations in the BackStackRecords, either to push or pop.       
        ...
        record.runOnCommitRunnables();//执行回BackStackRecord，调用runOnCommit注册的方法
        ...
}


//BackStackRecord
Fragment expandOps(ArrayList<Fragment> added, Fragment oldPrimaryNav) {
    for (int opNum = 0; opNum < mOps.size(); opNum++) {
        final Op op = mOps.get(opNum);
        switch (op.cmd) {
            case OP_ADD:
            case OP_ATTACH:
                added.add(op.fragment);
                break;
            case OP_REMOVE:
            case OP_DETACH: {
                added.remove(op.fragment);
                if (op.fragment == oldPrimaryNav) {
                    mOps.add(opNum, new Op(OP_UNSET_PRIMARY_NAV, op.fragment));
                    opNum++;
                    oldPrimaryNav = null;
                }
            }
            break;
            case OP_REPLACE: {//来到这里
                final Fragment f = op.fragment;
                final int containerId = f.mContainerId;
                boolean alreadyAdded = false;
                for (int i = added.size() - 1; i >= 0; i--) {
                    final Fragment old = added.get(i);
                    if (old.mContainerId == containerId) {
                        if (old == f) {
                            alreadyAdded = true;
                        } else {
                            // This is duplicated from above since we only make
                            // a single pass for expanding ops. Unset any outgoing primary nav.
                            if (old == oldPrimaryNav) {
                                mOps.add(opNum, new Op(OP_UNSET_PRIMARY_NAV, old));
                                opNum++;
                                oldPrimaryNav = null;
                            }
                            final Op removeOp = new Op(OP_REMOVE, old);
                            removeOp.enterAnim = op.enterAnim;
                            removeOp.popEnterAnim = op.popEnterAnim;
                            removeOp.exitAnim = op.exitAnim;
                            removeOp.popExitAnim = op.popExitAnim;
                            mOps.add(opNum, removeOp);
                            added.remove(old);
                            opNum++;
                        }
                    }
                }
                if (alreadyAdded) {
                    mOps.remove(opNum);
                    opNum--;
                } else {
                    op.cmd = OP_ADD;
                    added.add(f);
                }
            }
            break;
            case OP_SET_PRIMARY_NAV: {
                // It's ok if this is null, that means we will restore to no active
                // primary navigation fragment on a pop.
                mOps.add(opNum, new Op(OP_UNSET_PRIMARY_NAV, oldPrimaryNav));
                opNum++;
                // Will be set by the OP_SET_PRIMARY_NAV we inserted before when run
                oldPrimaryNav = op.fragment;
            }
            break;
        }
    }
    return oldPrimaryNav;
}

void executeOps() {
    final int numOps = mOps.size();
    for (int opNum = 0; opNum < numOps; opNum++) {
        final Op op = mOps.get(opNum);
        final Fragment f = op.fragment;
        if (f != null) {
            f.setNextTransition(mTransition, mTransitionStyle);
        }
        switch (op.cmd) {
            case OP_ADD:
                f.setNextAnim(op.enterAnim);
                mManager.addFragment(f, false);
                break;
            case OP_REMOVE:
                f.setNextAnim(op.exitAnim);
                mManager.removeFragment(f);
                break;
            case OP_HIDE:
                f.setNextAnim(op.exitAnim);
                mManager.hideFragment(f);
                break;
            case OP_SHOW:
                f.setNextAnim(op.enterAnim);
                mManager.showFragment(f);
                break;
            case OP_DETACH:
                f.setNextAnim(op.exitAnim);
                mManager.detachFragment(f);
                break;
            case OP_ATTACH:
                f.setNextAnim(op.enterAnim);
                mManager.attachFragment(f);
                break;
            case OP_SET_PRIMARY_NAV:
                mManager.setPrimaryNavigationFragment(f);
                break;
            case OP_UNSET_PRIMARY_NAV:
                mManager.setPrimaryNavigationFragment(null);
                break;
            default:
                throw new IllegalArgumentException("Unknown cmd: " + op.cmd);
        }
        if (!mReorderingAllowed && op.cmd != OP_ADD && f != null) {
            mManager.moveFragmentToExpectedState(f);
        }
    }
    if (!mReorderingAllowed) {
        // Added fragments are added at the end to comply with prior behavior.
        mManager.moveToState(mManager.mCurState, true);
    }
}

//
//FragmentManager

public void addFragment(Fragment fragment, boolean moveToStateNow) {
    if (moveToStateNow) {
        moveToState(fragment);
    }
}    
void moveToState(Fragment f, int newState, int transit, int transitionStyle,
        boolean keepActive) {
    if (f.mState <= newState) {
        switch (f.mState) {
                case Fragment.INITIALIZING:
                ...
                case Fragment.CREATED:
                ...
                case Fragment.ACTIVITY_CREATED:
                ...
                case Fragment.STARTED:
                ...
        }
    } else if (f.mState > newState) {
        switch (f.mState) {
                case Fragment.RESUMED:
                ...
                case Fragment.STARTED:
                ...
                case Fragment.ACTIVITY_CREATED:
                ...
                case Fragment.CREATED:
                ...
        }
                
    }
        
}
```

这里的流程有点复杂，大致流程如下：

`commit--->commitInternal--->FragmentManager中到enqueueAction--->scheduleCommit--->execPendingActions--->removeRedundantOperationsAndExecute--->executeOpsTogether--->expandOps`

最终会执行mManager.addFragment，然后调用moveToState来执行真正的操作。在这里面会调用Fragment的生命周期方法。


![](./3.jpg)

## 参考

- [https://www.jianshu.com/p/f2fcc670afd6](https://www.jianshu.com/p/f2fcc670afd6)
