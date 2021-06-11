---
title: Service工作过程
tags: Android
toc: true
---


## 概述

Service是Android四大组件之一，用于执行长时间运行且不需要用户交互的任务。即使应用被销毁也依然可以工作。
组件可通过绑定到服务与之进行交互，甚至是执行进程间通信 (IPC)。例如，服务可在后台处理网络事务、播放音乐，执行文件 I/O 或与内容提供程序进行交互。

**Service分为以下几种不同的类型：**

- 前台：前台服务必须显示通知（Notification），可以跟用户交互，比如播放音乐。
- 后台：用户无感知，可以做一些数据存储之类的事情。
- 绑定：使用bindService进行绑定。此种类型方便与其他组件进行交互。仅当与另一个应用组件绑定时，绑定服务才会运行。多个组件可同时绑定到该服务，
  但全部取消绑定后，该服务即会被销毁。

服务既可以是启动服务（以无限期运行），也支持绑定。唯一的问题在于是否实现一组回调方法：onStartCommand()（让组件启动服务）和 onBind()（实现服务绑定）。

## 基本使用

Service的使用跟Activity类似，需要先在清单文件中声明，然后使用Context启动（startService(Intent)）或绑定服务。服务在其托管进程的主线程中运行，
它既不创建自己的线程，也不在单独的进程中运行（除非在清单文件中配置）。如果有耗时操作，则可以在服务内创建线程来处理。


### 配置

```
<manifest ... >
  ...
  <application ... >
      <service android:name=".ExampleService" />
      ...
  </application>
</manifest>
```

### API




方法 | 描述
--- |---
onStartCommand() |	其他组件(如活动)通过调用startService()来请求启动服务时，系统调用该方法。如果你实现该方法，你有责任在工作完成时通过stopSelf()或者stopService()方法来停止服务。
onBind |	当其他组件想要通过bindService()来绑定服务时，系统调用该方法。如果你实现该方法，你需要返回IBinder对象来提供一个接口，以便客户来与服务通信。你必须实现该方法，如果你不允许绑定，则直接返回null。
onUnbind() |	当客户中断所有服务发布的特殊接口时，系统调用该方法。
onRebind() |	当新的客户端与服务连接，且此前它已经通过onUnbind(Intent)通知断开连接时，系统调用该方法。
onCreate() |	当服务通过onStartCommand()和onBind()被第一次创建的时候，系统调用该方法。该调用要求执行一次性安装。
onDestroy() |	当服务不再有用或者被销毁时，系统调用该方法。你的服务需要实现该方法来清理任何资源，如线程，已注册的监听器，接收器等。


如果组件通过调用 startService() 启动服务（这会引起对 onStartCommand() 的调用），则服务会一直运行，直到其使用 stopSelf() 自行停止运行，
或由其他组件通过调用 stopService() 将其停止为止。

如果组件通过调用 bindService() 来创建服务，且未调用 onStartCommand()，则服务只会在该组件与其绑定时运行。当该服务与其所有组件取消绑定后，
系统便会将其销毁。

### onStartCommand的注意事项

```java
public @StartResult int onStartCommand(Intent intent, @StartArgFlags int flags, int startId){}
```

**参数**

`intent` 

启动时传入的参数，当Service重启时可能为空

`flags`

- 0：正常创建
- START_FLAG_REDELIVERY：onStartCommand返回的是START_REDELIVER_INTENT，并且Service被系统清理掉了，那么重新创建Service，
  调用onStartCommand的时候，传入的intent不为null，而传入的flags就是START_FLAG_REDELIVERY
- START_FLAG_RETRY：如果Service创建过程中，onStartCommand方法未被调用或者没有正常返回的异常情况下， 再次尝试创建，传入的flags就为START_FLAG_RETRY 。

`startId`

用来代表这个唯一的启动请求。我们可以在stopSelfResult(int startId)中传入这个startId，用来终止Service。

**返回值**

- START_STICKY：如果Service所在的进程，在执行了onStartCommand方法后，被清理了，那么这个Service会被保留在已开始的状态，但是不保留传入的Intent，
  随后系统会尝试重新创建此Service，由于服务状态保留在已开始状态，所以创建服务后一定会调用onStartCommand方法。如果在此期间没有任何启动命令
  被传递到service，那么参数Intent将为null，需要我们小心处理。
- START_NOT_STICKY：如果Service所在的进程，在执行了onStartCommand方法后，被清理了，则系统不会重新启动此Service。
- START_REDELIVER_INTENT：如果Service所在的进程，在执行了onStartCommand方法后，被清理了，则结果和START_STICKY一样，也会重新创建此
  Service并调用onStartCommand方法。不同之处在于，如果是返回的是START_REDELIVER_INTENT ，则重新创建Service时onStartCommand方法
  会传入之前的intent。
- START_STICKY_COMPATIBILITY：START_STICKY的兼容版本，但是不能保证被清理后onStartCommand方法一定会被重新调用。


## 生命周期

![](./service_lifecyle.png)

## 源码分析

Service的启动方式是Context.startService(Intent service)。而Context的实现类为ContextImpl

```java
@Override
public ComponentName startService(Intent service) {
    warnIfCallingFromSystemProcess();
    return startServiceCommon(service, false, mUser);
}

private ComponentName startServiceCommon(Intent service, boolean requireForeground,
        UserHandle user) {
    try {
        validateServiceIntent(service);
        service.prepareToLeaveProcess(this);
        ComponentName cn = ActivityManager.getService().startService(
            mMainThread.getApplicationThread(), service, service.resolveTypeIfNeeded(
                        getContentResolver()), requireForeground,
                        getOpPackageName(), user.getIdentifier());
        if (cn != null) {
            if (cn.getPackageName().equals("!")) {
                throw new SecurityException(
                        "Not allowed to start service " + service
                        + " without permission " + cn.getClassName());
            } else if (cn.getPackageName().equals("!!")) {
                throw new SecurityException(
                        "Unable to start service " + service
                        + ": " + cn.getClassName());
            } else if (cn.getPackageName().equals("?")) {
                throw new IllegalStateException(
                        "Not allowed to start service " + service + ": " + cn.getClassName());
            }
        }
        return cn;
    } catch (RemoteException e) {
        throw e.rethrowFromSystemServer();
    }
}
```

由以上代码可知，调用了AMS中的startService方法

```java
@Override
public ComponentName startService(IApplicationThread caller, Intent service,
        String resolvedType, boolean requireForeground, String callingPackage, int userId)
        throws TransactionTooLargeException {
    enforceNotIsolatedCaller("startService");
    // Refuse possible leaked file descriptors
    if (service != null && service.hasFileDescriptors() == true) {
        throw new IllegalArgumentException("File descriptors passed in Intent");
    }

    if (callingPackage == null) {
        throw new IllegalArgumentException("callingPackage cannot be null");
    }

    if (DEBUG_SERVICE) Slog.v(TAG_SERVICE,
            "*** startService: " + service + " type=" + resolvedType + " fg=" + requireForeground);
    synchronized(this) {
        final int callingPid = Binder.getCallingPid();
        final int callingUid = Binder.getCallingUid();
        final long origId = Binder.clearCallingIdentity();
        ComponentName res;
        try {
            res = mServices.startServiceLocked(caller, service,
                    resolvedType, callingPid, callingUid,
                    requireForeground, callingPackage, userId);
        } finally {
            Binder.restoreCallingIdentity(origId);
        }
        return res;
    }
}

```
这里的mServices为ActiveServices，它是用来对Service进行管理的。我们进去看看startServiceLocked

```java
ComponentName startServiceLocked(IApplicationThread caller, Intent service, String resolvedType,
        int callingPid, int callingUid, boolean fgRequired, String callingPackage, final int userId)
        throws TransactionTooLargeException {
    return startServiceLocked(caller, service, resolvedType, callingPid, callingUid, fgRequired,
            callingPackage, userId, false);
}

ComponentName startServiceLocked(IApplicationThread caller, Intent service, String resolvedType,
        int callingPid, int callingUid, boolean fgRequired, String callingPackage,
        final int userId, boolean allowBackgroundActivityStarts)
        throws TransactionTooLargeException {
    if (DEBUG_DELAYED_STARTS) Slog.v(TAG_SERVICE, "startService: " + service
            + " type=" + resolvedType + " args=" + service.getExtras());

    ...

    if (allowBackgroundActivityStarts) {
        r.whitelistBgActivityStartsOnServiceStart();
    }

    ComponentName cmp = startServiceInnerLocked(smap, service, r, callerFg, addToStarting);
    return cmp;
}

ComponentName startServiceInnerLocked(ServiceMap smap, Intent service, ServiceRecord r,
        boolean callerFg, boolean addToStarting) throws TransactionTooLargeException {
    ServiceState stracker = r.getTracker();
    
    ...
    
    String error = bringUpServiceLocked(r, service.getFlags(), callerFg, false, false);
    if (error != null) {
        return new ComponentName("!!", error);
    }

    ...
    return r.name;
}

private String bringUpServiceLocked(ServiceRecord r, int intentFlags, boolean execInFg,
        boolean whileRestarting, boolean permissionsReviewRequired)
        throws TransactionTooLargeException {
    ...
    if (!isolated) {
        app = mAm.getProcessRecordLocked(procName, r.appInfo.uid, false);
        if (DEBUG_MU) Slog.v(TAG_MU, "bringUpServiceLocked: appInfo.uid=" + r.appInfo.uid
                    + " app=" + app);
        if (app != null && app.thread != null) {
            try {
                app.addPackage(r.appInfo.packageName, r.appInfo.longVersionCode, mAm.mProcessStats);
                realStartServiceLocked(r, app, execInFg);
                return null;
            } catch (TransactionTooLargeException e) {
                throw e;
            } catch (RemoteException e) {
                Slog.w(TAG, "Exception when starting service " + r.shortInstanceName, e);
            }
        }
    } else {
        app = r.isolatedProc;
        if (WebViewZygote.isMultiprocessEnabled()
                && r.serviceInfo.packageName.equals(WebViewZygote.getPackageName())) {
            hostingRecord = HostingRecord.byWebviewZygote(r.instanceName);
        }
        if ((r.serviceInfo.flags & ServiceInfo.FLAG_USE_APP_ZYGOTE) != 0) {
            hostingRecord = HostingRecord.byAppZygote(r.instanceName, r.definingPackageName,
                    r.definingUid);
        }
    }

    ...

    return null;
}
    
private final void realStartServiceLocked(ServiceRecord r,
    ProcessRecord app, boolean execInFg) throws RemoteException {
    
    r.setProcess(app);//绑定进程
...
try {
    if (LOG_SERVICE_START_STOP) {
        String nameTerm;
        int lastPeriod = r.shortInstanceName.lastIndexOf('.');
        nameTerm = lastPeriod >= 0 ? r.shortInstanceName.substring(lastPeriod)
                : r.shortInstanceName;
        EventLogTags.writeAmCreateService(
                r.userId, System.identityHashCode(r), nameTerm, r.app.uid, r.app.pid);
    }
    StatsLog.write(StatsLog.SERVICE_LAUNCH_REPORTED, r.appInfo.uid, r.name.getPackageName(),
            r.name.getClassName());
    synchronized (r.stats.getBatteryStats()) {
        r.stats.startLaunchedLocked();
    }
    mAm.notifyPackageUse(r.serviceInfo.packageName,
                         PackageManager.NOTIFY_PACKAGE_USE_SERVICE);
    app.forceProcessStateUpTo(ActivityManager.PROCESS_STATE_SERVICE);
    app.thread.scheduleCreateService(r, r.serviceInfo,
            mAm.compatibilityInfoForPackage(r.serviceInfo.applicationInfo),
            app.getReportedProcState());
    r.postNotification();
    created = true;
} catch (DeadObjectException e) {
    Slog.w(TAG, "Application dead when creating service " + r);
    mAm.appDiedLocked(app);
    throw e;
} finally {
    
}
...
    sendServiceArgsLocked(r, execInFg, true);//执行onStartCommand过程
}

private final void sendServiceArgsLocked(ServiceRecord r, boolean execInFg,
        boolean oomAdjusted) throws TransactionTooLargeException {
    ...
    
    Exception caughtException = null;
    try {
        r.app.thread.scheduleServiceArgs(r, slice); //调用ActivityThread
    } catch (TransactionTooLargeException e) {
        if (DEBUG_SERVICE) Slog.v(TAG_SERVICE, "Transaction too large for " + args.size()
                + " args, first: " + args.get(0).args);
        Slog.w(TAG, "Failed delivering service starts", e);
        caughtException = e;
    } catch (RemoteException e) {
        if (DEBUG_SERVICE) Slog.v(TAG_SERVICE, "Crashed while sending args: " + r);
        Slog.w(TAG, "Failed delivering service starts", e);
        caughtException = e;
    } catch (Exception e) {
        Slog.w(TAG, "Unexpected exception", e);
        caughtException = e;
    }
    ...
}

```

由以上代码可知，startServiceLocked调用了startServiceInnerLocked，startServiceInnerLocked调用了bringUpServiceLocked，
bringUpServiceLocked调用了realStartServiceLocked，realStartServiceLocked调用了ActivityThread的scheduleCreateService。
且realStartServiceLocked还会调用sendServiceArgsLocked，sendServiceArgsLocked调用ActivityThread的scheduleServiceArgs，
这里会启动onStartCommand


```java

public final void scheduleCreateService(IBinder token,
        ServiceInfo info, CompatibilityInfo compatInfo, int processState) {
    updateProcessState(processState, false);
    CreateServiceData s = new CreateServiceData();
    s.token = token;
    s.info = info;
    s.compatInfo = compatInfo;

    sendMessage(H.CREATE_SERVICE, s);
}

public void handleMessage(Message msg) {
    if (DEBUG_MESSAGES) Slog.v(TAG, ">>> handling: " + codeToString(msg.what));
    switch (msg.what) {
    ...
        case CREATE_SERVICE:
            Trace.traceBegin(Trace.TRACE_TAG_ACTIVITY_MANAGER, ("serviceCreate: " + String.valueOf(msg.obj)));
            handleCreateService((CreateServiceData)msg.obj);
            Trace.traceEnd(Trace.TRACE_TAG_ACTIVITY_MANAGER);
            break;
        case SERVICE_ARGS:
            Trace.traceBegin(Trace.TRACE_TAG_ACTIVITY_MANAGER, ("serviceStart: " + String.valueOf(msg.obj)));
            handleServiceArgs((ServiceArgsData)msg.obj);
            Trace.traceEnd(Trace.TRACE_TAG_ACTIVITY_MANAGER);
            break;
    ...
}

private void handleCreateService(CreateServiceData data) {

   //创建对象
    LoadedApk packageInfo = getPackageInfoNoCheck(
            data.info.applicationInfo, data.compatInfo);
    Service service = null;
    try {
        ClassLoader cl = packageInfo.getClassLoader();
        //创建service对象
        service = packageInfo.getAppFactory()
                .instantiateService(cl, data.info.name, data.intent);
    } catch (Exception e) {}
    try {
        //创建上下文
        ContextImpl context = ContextImpl.createAppContext(this, packageInfo);
        //关联service对象
        context.setOuterContext(service);
        //获取Application对象
        Application app = packageInfo.makeApplication(false, mInstrumentation);
        //关联上下文和Application对象
        service.attach(context, this, data.info.name, data.token, app,
                ActivityManager.getService());
        service.onCreate();
        //data.token都是ServiceRecord，它是binder对象，token与service建立映射关系存储在mServices的map中
        mServices.put(data.token, service);
    } catch (Exception e) {}
}
    
//onStartCommand流程    
public final void scheduleServiceArgs(IBinder token, ParceledListSlice args) {
    List<ServiceStartArgs> list = args.getList();

    for (int i = 0; i < list.size(); i++) {
        ServiceStartArgs ssa = list.get(i);
        ServiceArgsData s = new ServiceArgsData();
        s.token = token;
        s.taskRemoved = ssa.taskRemoved;
        s.startId = ssa.startId;
        s.flags = ssa.flags;
        s.args = ssa.args;

        sendMessage(H.SERVICE_ARGS, s);
    }
}    

private void handleServiceArgs(ServiceArgsData data) {
    Service s = mServices.get(data.token);
    if (s != null) {
        try {
            if (data.args != null) {
                data.args.setExtrasClassLoader(s.getClassLoader());
                data.args.prepareToEnterProcess();
            }
            int res;
            if (!data.taskRemoved) {
                res = s.onStartCommand(data.args, data.flags, data.startId);//运行了onStartCommand方法
            } else {
                s.onTaskRemoved(data.args);
                res = Service.START_TASK_REMOVED_COMPLETE;
            }

            QueuedWork.waitToFinish();

            try {
                ActivityManager.getService().serviceDoneExecuting(
                        data.token, SERVICE_DONE_EXECUTING_START, data.startId, res);
            } catch (RemoteException e) {
                throw e.rethrowFromSystemServer();
            }
        } catch (Exception e) {
            if (!mInstrumentation.onException(s, e)) {
                throw new RuntimeException(
                        "Unable to start service " + s
                        + " with " + data.args + ": " + e.toString(), e);
            }
        }
    }
}

```

由以上代码可知
- scheduleCreateService发送了CREATE_SERVICE消息。ActivityThread的内部类H处理此消息，在handleCreateService方法中，
运行了Service的onCreate方法。
- scheduleServiceArgs发送了SERVICE_ARGS的消息。在handleServiceArgs中处理，调用了onStartCommand方法

## 流程图

![](./service_process_1.jpg)


## 参考

- [Android 10 Service 工作过程](https://www.jianshu.com/p/d3d5f3673829)
- 《Android开发艺术探索》
- [https://developer.android.com/guide/components/services?hl=zh-cn](https://developer.android.com/guide/components/services?hl=zh-cn)
