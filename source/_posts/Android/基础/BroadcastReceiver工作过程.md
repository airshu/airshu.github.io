---
title: BroadcastReceiver工作过程
tags: Android
toc: true
---


## 概述

BroadcastReceiver是一种消息型组件。由于BroadcastReceiver可以在不同的组件甚至不同的应用之间传递消息，所以其可以脱离Activity实现，
除了要在AndroidManifest.xml中注册广播类名外，还需要添加intentfilter，这样就可以让receiver选择性的接收广播。当注册完成之后，即使没有Activity启动，
也可以接收广播。在实现 BroadcastReceiver时，需要继承 BroadcastReceiver抽象类，但是不需要重写onCreat()方法，只需重写onReceive()方法，
因此，Service没有启动和停止的概念，更像是一个系统级的监听器。


## 流程分析


广播的注册分为静态注册和动态注册，其中静态注册的广播在应用安装时由系统自动完成注册，具体来说是由PMS(PackageManagerService)来完成整个注册过程的。

### 注册过程

动态注册的过程是从ContextWrapper的registerReceiver方法开始的。

我们从该方法开始

```java
//ContextWrapper.java

public Intent registerReceiver(
    BroadcastReceiver receiver, IntentFilter filter) {
    return mBase.registerReceiver(receiver, filter);
}


//ContextImpl.java

private Intent registerReceiverInternal(BroadcastReceiver receiver, int userId,
        IntentFilter filter, String broadcastPermission,
        Handler scheduler, Context context, int flags) {
    IIntentReceiver rd = null;
    if (receiver != null) {
        if (mPackageInfo != null && context != null) {
            if (scheduler == null) {
                scheduler = mMainThread.getHandler();
            }
            //返回ReceiverDispatcher
            rd = mPackageInfo.getReceiverDispatcher(
                receiver, context, scheduler,
                mMainThread.getInstrumentation(), true);
        } else {
            if (scheduler == null) {
                scheduler = mMainThread.getHandler();
            }
            rd = new LoadedApk.ReceiverDispatcher(
                    receiver, context, scheduler, null, true).getIIntentReceiver();
        }
    }
    try {
    //ActivityManagerService注册
        final Intent intent = ActivityManager.getService().registerReceiver(
                mMainThread.getApplicationThread(), mBasePackageName, rd, filter,
                broadcastPermission, userId, flags);
        if (intent != null) {
            intent.setExtrasClassLoader(getClassLoader());
            intent.prepareToEnterProcess();
        }
        return intent;
    } catch (RemoteException e) {
        throw e.rethrowFromSystemServer();
    }
}

```

在上面的代码中，系统首先从mPackageInfo获取IIntentReceiver对象，然后再采用跨进程的方式向AMS发送广播注册的请求。
之所以采用IIntentReceiver而不是直接采用BroadcastReceiver，这是因为上述注册过程是一个进程间通信的过程，而BroadcastReceiver作为Android的
一个组件是不能直接跨进程传递的，所以需要通过IIntentReceiver来中转一下。毫无疑问，IIntentReceiver必须是一个Binder接口，
它的具体实现是LoadedApk.ReceiverDispatcher.InnerReceiver，ReceiverDispatcher的内部同时保存了BroadcastReceiver和InnerReceiver，
这样当接收到广播时，ReceiverDispatcher可以很方便地调用BroadcastReceiver的onReceive方法。


```java
ActivityManagerService.java

public Intent registerReceiver(IApplicationThread caller, String callerPackage,
        IIntentReceiver receiver, IntentFilter filter, String permission, int userId,
        int flags) {
        
}
            
```

### 发送和接收过程

**广播类型：**

- 普通广播(Normal Broadcast)
- 系统广播(System Broadcast)
- 有序广播(Ordered Broadcast)
- 粘性广播(Sticky Broadcast)
- App应用内广播(Local Broadcast)




发送广播从sendBroadcast开始

```java

//ContextImpl.java

public void sendBroadcast(Intent intent) {
    warnIfCallingFromSystemProcess();
    String resolvedType = intent.resolveTypeIfNeeded(getContentResolver());
    try {
        intent.prepareToLeaveProcess(this);
        ActivityManager.getService().broadcastIntent(
                mMainThread.getApplicationThread(), intent, resolvedType, null,
                Activity.RESULT_OK, null, null, null, AppOpsManager.OP_NONE, null, false, false,
                getUserId());
    } catch (RemoteException e) {
        throw e.rethrowFromSystemServer();
    }
}



//ActivityManagerService

public final int broadcastIntent(IApplicationThread caller,
        Intent intent, String resolvedType, IIntentReceiver resultTo,
        int resultCode, String resultData, Bundle resultExtras,
        String[] requiredPermissions, int appOp, Bundle bOptions,
        boolean serialized, boolean sticky, int userId) {
    enforceNotIsolatedCaller("broadcastIntent");
    synchronized(this) {
        intent = verifyBroadcastLocked(intent);

        final ProcessRecord callerApp = getRecordForAppLocked(caller);
        final int callingPid = Binder.getCallingPid();
        final int callingUid = Binder.getCallingUid();

        final long origId = Binder.clearCallingIdentity();
        try {
            return broadcastIntentLocked(callerApp,
                    callerApp != null ? callerApp.info.packageName : null,
                    intent, resolvedType, resultTo, resultCode, resultData, resultExtras,
                    requiredPermissions, appOp, bOptions, serialized, sticky,
                    callingPid, callingUid, callingUid, callingPid, userId);
        } finally {
            Binder.restoreCallingIdentity(origId);
        }
    }
}


final int broadcastIntentLocked(ProcessRecord callerApp,
        String callerPackage, Intent intent, String resolvedType,
        IIntentReceiver resultTo, int resultCode, String resultData,
        Bundle resultExtras, String[] requiredPermissions, int appOp, Bundle bOptions,
        boolean ordered, boolean sticky, int callingPid, int callingUid, int realCallingUid,
        int realCallingPid, int userId, boolean allowBackgroundActivityStarts) {
    intent = new Intent(intent);

    final boolean callerInstantApp = isInstantApp(callerApp, callerPackage, callingUid);
    // Instant Apps cannot use FLAG_RECEIVER_VISIBLE_TO_INSTANT_APPS
    if (callerInstantApp) {
        intent.setFlags(intent.getFlags() & ~Intent.FLAG_RECEIVER_VISIBLE_TO_INSTANT_APPS);
    }

    // By default broadcasts do not go to stopped apps.
    intent.addFlags(Intent.FLAG_EXCLUDE_STOPPED_PACKAGES);

    // If we have not finished booting, don't allow this to launch new processes.
    if (!mProcessesReady && (intent.getFlags()&Intent.FLAG_RECEIVER_BOOT_UPGRADE) == 0) {
        intent.addFlags(Intent.FLAG_RECEIVER_REGISTERED_ONLY);
    }
...
     final BroadcastRecord oldRecord =
                    replacePending ? queue.replaceOrderedBroadcastLocked(r) : null;
            if (oldRecord != null) {
                // Replaced, fire the result-to receiver.
                if (oldRecord.resultTo != null) {
                    final BroadcastQueue oldQueue = broadcastQueueForIntent(oldRecord.intent);
                    try {
                        oldQueue.performReceiveLocked(oldRecord.callerApp, oldRecord.resultTo,
                                oldRecord.intent,
                                Activity.RESULT_CANCELED, null, null,
                                false, false, oldRecord.userId);
                    } catch (RemoteException e) {
                        Slog.w(TAG, "Failure ["
                                + queue.mQueueName + "] sending broadcast result of "
                                + intent, e);

                    }
                }
            } else {
                queue.enqueueOrderedBroadcastLocked(r);
                queue.scheduleBroadcastsLocked();
            }
            ...
            
            

}


//BroadcastQueue.java

public void scheduleBroadcastsLocked() {
    if (DEBUG_BROADCAST) Slog.v(TAG_BROADCAST, "Schedule broadcasts ["
            + mQueueName + "]: current="
            + mBroadcastsScheduled);

    if (mBroadcastsScheduled) {
        return;
    }
    mHandler.sendMessage(mHandler.obtainMessage(BROADCAST_INTENT_MSG, this));
    mBroadcastsScheduled = true;
}
//处理BROADCAST_INTENT_MSG
final void processNextBroadcast(boolean fromMsg) {
    synchronized (mService) {
        processNextBroadcastLocked(fromMsg, false);
    }
}

final void processNextBroadcastLocked(boolean fromMsg, boolean skipOomAdj) {
...
performReceiveLocked(r.callerApp, r.resultTo,
                                    new Intent(r.intent), r.resultCode,
                                    r.resultData, r.resultExtras, false, false, r.userId);
...
}
void performReceiveLocked(ProcessRecord app, IIntentReceiver receiver,
        Intent intent, int resultCode, String data, Bundle extras,
        boolean ordered, boolean sticky, int sendingUser)
        throws RemoteException {
    // Send the intent to the receiver asynchronously using one-way binder calls.
    if (app != null) {
        if (app.thread != null) {
            // If we have an app thread, do the call through that so it is
            // correctly ordered with other one-way calls.
            try {
            //ActivityThread.ApplicationThread
                app.thread.scheduleRegisteredReceiver(receiver, intent, resultCode,
                        data, extras, ordered, sticky, sendingUser, app.getReportedProcState());
            // TODO: Uncomment this when (b/28322359) is fixed and we aren't getting
            // DeadObjectException when the process isn't actually dead.
            //} catch (DeadObjectException ex) {
            // Failed to call into the process.  It's dying so just let it die and move on.
            //    throw ex;
            } catch (RemoteException ex) {
                // Failed to call into the process. It's either dying or wedged. Kill it gently.
                synchronized (mService) {
                    Slog.w(TAG, "Can't deliver broadcast to " + app.processName
                            + " (pid " + app.pid + "). Crashing it.");
                    app.scheduleCrash("can't deliver broadcast");
                }
                throw ex;
            }
        } else {
            // Application has died. Receiver doesn't exist.
            throw new RemoteException("app.thread must not be null");
        }
    } else {
        receiver.performReceive(intent, resultCode, data, extras, ordered,
                sticky, sendingUser);
    }
}

//ActivityThread.ApplicationThread
public void scheduleRegisteredReceiver(IIntentReceiver receiver, Intent intent,
        int resultCode, String dataStr, Bundle extras, boolean ordered,
        boolean sticky, int sendingUser, int processState) throws RemoteException {
    updateProcessState(processState, false);
    //实际调用LoadedApk.ReceiverDispatcher.InnerReceiver
    receiver.performReceive(intent, resultCode, dataStr, extras, ordered,
            sticky, sendingUser);
}


//LoadedApk.ReceiverDispatcher.InnerReceiver
public void performReceive(Intent intent, int resultCode, String data,
        Bundle extras, boolean ordered, boolean sticky, int sendingUser) {
    final LoadedApk.ReceiverDispatcher rd;
    if (intent == null) {
        Log.wtf(TAG, "Null intent received");
        rd = null;
    } else {
        rd = mDispatcher.get();
    }
    if (ActivityThread.DEBUG_BROADCAST) {
        int seq = intent.getIntExtra("seq", -1);
        Slog.i(ActivityThread.TAG, "Receiving broadcast " + intent.getAction()
                + " seq=" + seq + " to " + (rd != null ? rd.mReceiver : null));
    }
    if (rd != null) {
        rd.performReceive(intent, resultCode, data, extras,
                ordered, sticky, sendingUser);
    } else {
        // The activity manager dispatched a broadcast to a registered
        // receiver in this process, but before it could be delivered the
        // receiver was unregistered.  Acknowledge the broadcast on its
        // behalf so that the system's broadcast sequence can continue.
        if (ActivityThread.DEBUG_BROADCAST) Slog.i(ActivityThread.TAG,
                "Finishing broadcast to unregistered receiver");
        IActivityManager mgr = ActivityManager.getService();
        try {
            if (extras != null) {
                extras.setAllowFds(false);
            }
            mgr.finishReceiver(this, resultCode, data, extras, false, intent.getFlags());
        } catch (RemoteException e) {
            throw e.rethrowFromSystemServer();
        }
    }
}

public void performReceive(Intent intent, int resultCode, String data,
        Bundle extras, boolean ordered, boolean sticky, int sendingUser) {
    final Args args = new Args(intent, resultCode, data, extras, ordered,
            sticky, sendingUser);
    if (intent == null) {
        Log.wtf(TAG, "Null intent received");
    } else {
        if (ActivityThread.DEBUG_BROADCAST) {
            int seq = intent.getIntExtra("seq", -1);
            Slog.i(ActivityThread.TAG, "Enqueueing broadcast " + intent.getAction()
                    + " seq=" + seq + " to " + mReceiver);
        }
    }
    //会创建一个Args对象并通过mActivityThread的post方法来执行Args中的逻辑，而Args实现了Runnable接口。mActivityThread是一个Handler，
    //它其实就是ActivityThread中的mH，mH的类型是 ActivityThread的内部类H
    if (intent == null || !mActivityThread.post(args.getRunnable())) {
        if (mRegistered && ordered) {
            IActivityManager mgr = ActivityManager.getService();
            if (ActivityThread.DEBUG_BROADCAST) Slog.i(ActivityThread.TAG,
                    "Finishing sync broadcast to " + mReceiver);
            args.sendFinished(mgr);
        }
    }
}


//LoaderApk.ReceiverDispatcher.Args
final class Args extends BroadcastReceiver.PendingResult {
    public final Runnable getRunnable() {
                return () -> {
                ...
                    ClassLoader cl = mReceiver.getClass().getClassLoader();
                    intent.setExtrasClassLoader(cl);
                    intent.prepareToEnterProcess();
                    setExtrasClassLoader(cl);
                    receiver.setPendingResult(this);
                    receiver.onReceive(mContext, intent);//接收到消息了
                ...
                }
    }
}

```

在broadcastIntentLocked的内部，会根据intent-filter查找出匹配的广播接收者并经过一系列的条件过滤，最终会将满足条件的广播接收者添加到BroadcastQueue中，
接着BroadcastQueue就会将广播发送给相应的广播接收者。

## 流程图

![](./1.jpg)


## 参考

- 《Android开发艺术探索》
