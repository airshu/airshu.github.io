---
title: ContentProvider工作过程
tags: Android
toc: true
---

## 概要

ContentProvider主要用来给不同应用提供数据，当其所在进程启动时，ContentProvider会同时启动并发布到AMS中。

当android:multiprocess为true时，ContentProvider为多实例。

其提供了query、update、delete、insert等接口，方便我们进行数据操作。

## 启动流程

我们要使用ContentProvider，需要通过getContentResolver()，实际是ApplicationContentResolver对象。

我们从query方法入手

```java
//开始查询
Cursor cursor = getContentResolver().query(Uri.parse("content://com.lqd.androidpractice.provider.UsersProvider/users"), null, null, null, null);


//ContentResolver.java

public final @Nullable Cursor query(final @RequiresPermission.Read @NonNull Uri uri,
        @Nullable String[] projection, @Nullable Bundle queryArgs,
        @Nullable CancellationSignal cancellationSignal) {
    Preconditions.checkNotNull(uri, "uri");

    try {
        if (mWrapped != null) {
            return mWrapped.query(uri, projection, queryArgs, cancellationSignal);
        }
    } catch (RemoteException e) {
        return null;
    }

    IContentProvider unstableProvider = acquireUnstableProvider(uri);//调用子类ApplicationContentResolver
    if (unstableProvider == null) {
        return null;
    }
....    
}


//ContextImpl的静态内部类ApplicationContentResolver

@Override
protected IContentProvider acquireUnstableProvider(Context c, String auth) {
    //ActivityThread
    return mMainThread.acquireProvider(c,
            ContentProvider.getAuthorityWithoutUserId(auth),
            resolveUserIdFromAuthority(auth), false);
}


//ActivityThread.java

//存储Provider对象
final ArrayMap<IBinder, ProviderRefCount> mProviderRefCountMap
        = new ArrayMap<IBinder, ProviderRefCount>();
        
public final IContentProvider acquireProvider(
        Context c, String auth, int userId, boolean stable) {
    final IContentProvider provider = acquireExistingProvider(c, auth, userId, stable);
    if (provider != null) {
        return provider;
    }

    // There is a possible race here.  Another thread may try to acquire
    // the same provider at the same time.  When this happens, we want to ensure
    // that the first one wins.
    // Note that we cannot hold the lock while acquiring and installing the
    // provider since it might take a long time to run and it could also potentially
    // be re-entrant in the case where the provider is in the same process.
    ContentProviderHolder holder = null;
    try {
        synchronized (getGetProviderLock(auth, userId)) {
            holder = ActivityManager.getService().getContentProvider(
                    getApplicationThread(), c.getOpPackageName(), auth, userId, stable);
        }
    } catch (RemoteException ex) {
        throw ex.rethrowFromSystemServer();
    }
    if (holder == null) {
        Slog.e(TAG, "Failed to find provider info for " + auth);
        return null;
    }

    // Install provider will increment the reference count for us, and break
    // any ties in the race.
    holder = installProvider(c, holder, holder.info,
            true /*noisy*/, holder.noReleaseNeeded, stable);
    return holder.provider;
}

private ContentProviderHolder installProvider(Context context,
        ContentProviderHolder holder, ProviderInfo info,
        boolean noisy, boolean noReleaseNeeded, boolean stable) {
    ContentProvider localProvider = null;
    ..
    mProviderRefCountMap.put(jBinder, prc);//添加到Map中
    ...
}
```

由以上代码可知，没有就创建Provider，创建完后会添加到mProviderRefCountMap中。如果Provider对应到进程有启动，则在Application启动时同时初始化了Provider。


```java
ActivityThread.java

public static void main(String[] args) {
...
ActivityThread thread = new ActivityThread();
thread.attach(false, startSeq);

...
}

private void attach(boolean system, long startSeq) {
    sCurrentActivityThread = this;
    mSystemThread = system;
    if (!system) {
        android.ddm.DdmHandleAppName.setAppName("<pre-initialized>",
                                                UserHandle.myUserId());
        RuntimeInit.setApplicationObject(mAppThread.asBinder());
        final IActivityManager mgr = ActivityManager.getService();
        try {
            mgr.attachApplication(mAppThread, startSeq);//ActivityManagerService
        } catch (RemoteException ex) {
            throw ex.rethrowFromSystemServer();
        }
        
        ....
    }
}

//ActivityManagerService.java

@Override
public final void attachApplication(IApplicationThread thread, long startSeq) {
    synchronized (this) {
        int callingPid = Binder.getCallingPid();
        final int callingUid = Binder.getCallingUid();
        final long origId = Binder.clearCallingIdentity();
        attachApplicationLocked(thread, callingPid, callingUid, startSeq);
        Binder.restoreCallingIdentity(origId);
    }
}


private final boolean attachApplicationLocked(IApplicationThread thread,
        int pid, int callingUid, long startSeq) {

    ....
        if (app.isolatedEntryPoint != null) {
            // This is an isolated process which should just call an entry point instead of
            // being bound to an application.
            thread.runIsolatedEntryPoint(app.isolatedEntryPoint, app.isolatedEntryPointArgs);
        } else if (instr2 != null) {
        //ApplicationThread
            thread.bindApplication(processName, appInfo, providers,
                    instr2.mClass,
                    profilerInfo, instr2.mArguments,
                    instr2.mWatcher,
                    instr2.mUiAutomationConnection, testMode,
                    mBinderTransactionTrackingEnabled, enableTrackAllocation,
                    isRestrictedBackupMode || !normalMode, app.isPersistent(),
                    new Configuration(app.getWindowProcessController().getConfiguration()),
                    app.compat, getCommonServicesLocked(app.isolated),
                    mCoreSettingsObserver.getCoreSettingsLocked(),
                    buildSerial, autofillOptions, contentCaptureOptions);
        } else {
            thread.bindApplication(processName, appInfo, providers, null, profilerInfo,
                    null, null, null, testMode,
                    mBinderTransactionTrackingEnabled, enableTrackAllocation,
                    isRestrictedBackupMode || !normalMode, app.isPersistent(),
                    new Configuration(app.getWindowProcessController().getConfiguration()),
                    app.compat, getCommonServicesLocked(app.isolated),
                    mCoreSettingsObserver.getCoreSettingsLocked(),
                    buildSerial, autofillOptions, contentCaptureOptions);
        }
        
        ...
        
    }
    
}

```

AMS的attachApplication方法调用了attachApplicationLocked方法，attachApplicationLocked中又调用了ApplicationThread的bindApplication，注意这个过程也是进程间调用。

```java
ActivityThread的内部类ApplicationThread

public final void bindApplication(String processName, ApplicationInfo appInfo,
        List<ProviderInfo> providers, ComponentName instrumentationName,
        ProfilerInfo profilerInfo, Bundle instrumentationArgs,
        IInstrumentationWatcher instrumentationWatcher,
        IUiAutomationConnection instrumentationUiConnection, int debugMode,
        boolean enableBinderTracking, boolean trackAllocation,
        boolean isRestrictedBackupMode, boolean persistent, Configuration config,
        CompatibilityInfo compatInfo, Map services, Bundle coreSettings,
        String buildSerial, AutofillOptions autofillOptions,
        ContentCaptureOptions contentCaptureOptions) {
    if (services != null) {
        if (false) {
            // Test code to make sure the app could see the passed-in services.
            for (Object oname : services.keySet()) {
                if (services.get(oname) == null) {
                    continue; // AM just passed in a null service.
                }
                String name = (String) oname;

                // See b/79378449 about the following exemption.
                switch (name) {
                    case "package":
                    case Context.WINDOW_SERVICE:
                        continue;
                }

                if (ServiceManager.getService(name) == null) {
                    Log.wtf(TAG, "Service " + name + " should be accessible by this app");
                }
            }
        }

        // Setup the service cache in the ServiceManager
        ServiceManager.initServiceCache(services);
    }

    setCoreSettings(coreSettings);

    AppBindData data = new AppBindData();
    data.processName = processName;
    data.appInfo = appInfo;
    data.providers = providers;
    data.instrumentationName = instrumentationName;
    data.instrumentationArgs = instrumentationArgs;
    data.instrumentationWatcher = instrumentationWatcher;
    data.instrumentationUiAutomationConnection = instrumentationUiConnection;
    data.debugMode = debugMode;
    data.enableBinderTracking = enableBinderTracking;
    data.trackAllocation = trackAllocation;
    data.restrictedBackupMode = isRestrictedBackupMode;
    data.persistent = persistent;
    data.config = config;
    data.compatInfo = compatInfo;
    data.initProfilerInfo = profilerInfo;
    data.buildSerial = buildSerial;
    data.autofillOptions = autofillOptions;
    data.contentCaptureOptions = contentCaptureOptions;
    sendMessage(H.BIND_APPLICATION, data);
}


private void handleBindApplication(AppBindData data) {
...
//Context初始化
final ContextImpl appContext = ContextImpl.createAppContext(this, data.info);
        updateLocaleListFromAppContext(appContext,
                mResourcesManager.getConfiguration().getLocales());
                
...
//Instrumentation初始化
    try {
        final ClassLoader cl = instrContext.getClassLoader();
        mInstrumentation = (Instrumentation)
            cl.loadClass(data.instrumentationName.getClassName()).newInstance();
    } catch (Exception e) {
        throw new RuntimeException(
            "Unable to instantiate instrumentation "
            + data.instrumentationName + ": " + e.toString(), e);
    }

    final ComponentName component = new ComponentName(ii.packageName, ii.name);
    mInstrumentation.init(this, instrContext, appContext, component,
            data.instrumentationWatcher, data.instrumentationUiAutomationConnection);
....
//Application初始化
    try {
        // If the app is being launched for full backup or restore, bring it up in
        // a restricted environment with the base application class.
        app = data.info.makeApplication(data.restrictedBackupMode, null);

        // Propagate autofill compat state
        app.setAutofillOptions(data.autofillOptions);

        // Propagate Content Capture options
        app.setContentCaptureOptions(data.contentCaptureOptions);

        mInitialApplication = app;
        
        if (!data.restrictedBackupMode) {
            if (!ArrayUtils.isEmpty(data.providers)) {
                installContentProviders(app, data.providers);//初始化Provider，添加到Map中
            }
        }            
...

        try {
                mInstrumentation.callApplicationOnCreate(app);//调用Application的onCreate，由此可知，ContentProvider的onCreate要先调用
            } catch (Exception e) {
                if (!mInstrumentation.onException(app, e)) {
                    throw new RuntimeException(
                      "Unable to create application " + app.getClass().getName()
                      + ": " + e.toString(), e);
                }
            }
            ...
}

private ContentProviderHolder installProvider(Context context,
            ContentProviderHolder holder, ProviderInfo info,
            boolean noisy, boolean noReleaseNeeded, boolean stable) {
    ContentProvider localProvider = null;
    ...
   try {
    final java.lang.ClassLoader cl = c.getClassLoader();
    LoadedApk packageInfo = peekPackageInfo(ai.packageName, true);
    if (packageInfo == null) {
        // System startup case.
        packageInfo = getSystemContext().mPackageInfo;
    }
    localProvider = packageInfo.getAppFactory()
            .instantiateProvider(cl, info.name);
    provider = localProvider.getIContentProvider();
    if (provider == null) {
        Slog.e(TAG, "Failed to instantiate class " +
              info.name + " from sourceDir " +
              info.applicationInfo.sourceDir);
        return null;
    }
    if (DEBUG_PROVIDER) Slog.v(
        TAG, "Instantiating local provider " + info.name);
    // XXX Need to create the correct context for this provider.
    localProvider.attachInfo(c, info);//进入ContentProvider
} catch (java.lang.Exception e) {
    if (!mInstrumentation.onException(null, e)) {
        throw new RuntimeException(
                "Unable to get provider " + info.name
                + ": " + e.toString(), e);
    }
    return null;
    
    ...
}
            
//ContentProvider.java

private void attachInfo(Context context, ProviderInfo info, boolean testing) {
    mNoPerms = testing;
    mCallingPackage = new ThreadLocal<>();

    /*
     * Only allow it to be set once, so after the content service gives
     * this to us clients can't change it.
     */
    if (mContext == null) {
        mContext = context;
        if (context != null && mTransport != null) {
            mTransport.mAppOpsManager = (AppOpsManager) context.getSystemService(
                    Context.APP_OPS_SERVICE);
        }
        mMyUid = Process.myUid();
        if (info != null) {
            setReadPermission(info.readPermission);
            setWritePermission(info.writePermission);
            setPathPermissions(info.pathPermissions);
            mExported = info.exported;
            mSingleUser = (info.flags & ProviderInfo.FLAG_SINGLE_USER) != 0;
            setAuthorities(info.authority);
        }
        ContentProvider.this.onCreate();//调用生命周期函数
    }
}

```

由以上代码可知，Provider的创建步骤如下：

1. 创建ContextImpl和Instrumentation
2. 创建Application对象
3. 启动当前进程的ContentProvider并调用其onCreate
4. 调用Application的onCreate方法

## 流程图

![](./1.jpg)

## 参考

- 《Android开发艺术探索》
