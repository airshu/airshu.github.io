---
title: 集成到现有Android应用
tags: React Native 
---


> 不同版本的RN可能配置不一样，这里使用0.62版本

## 1. 创建一个空目录用于存放React Native项目，然后在其中创建一个/android子目录，把现有的Android项目拷贝到该目录

## 2. 安装JavaScript依赖包

在项目根目录创建package.json空文件，填入以下内容；
```
{
  "name": "MyReactNativeApp",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "start": "yarn react-native start"
  }
}
```

然后运行：yarn add react-native@0.62.1，如果不写版本号会默认安装最新版本的React Native，同时会出现类似以下的警告信息：

```
warning "react-native@0.52.2" has unmet peer dependency "react@16.2.0".
```

只需要再次安装对应版本即可：yarn add react@16.2.0

这里其实也可以不用手动创建package.json文件，命令添加react-native后会自动生成这个文件。Android项目会依赖node_modules中react-native中的aar

## 3. 修改Android项目，添加React Native

### 3.1 根目录build.gradle文件配置仓库地址

```

def REACT_NATIVE_VERSION = new File(['node', '--print',"JSON.parse(require('fs').readFileSync(require.resolve('react-native/package.json'), 'utf-8')).version"].execute(null, rootDir).text.trim())

allprojects {
    repositories {
        maven {
            // All of React Native (JS, Android binaries) is installed from npm
            url "$rootDir/../node_modules/react-native/android"
        }
        maven {
            // Android JSC is installed from npm
            url("$rootDir/../node_modules/jsc-android/dist")
        }
        ...   
    }

    //这里会强制项目的版本号跟node_modules中的一致
    configurations.all {
        resolutionStrategy {
            // Remove this override in 0.65+, as a proper fix is included in react-native itself.
            force "com.facebook.react:react-native:" + REACT_NATIVE_VERSION
        }
    }
    ...
}
```

### 3.2 配置依赖

```
dependencies {
    implementation "com.android.support:appcompat-v7:27.1.1"
    ...
    implementation "com.facebook.react:react-native:+" // +表示使用本地的仓库依赖
    implementation "org.webkit:android-jsc:+"
}
```

> 注意：Android项目和RN项目要保持统一的依赖版本，有些文章说找不到库使用固定版本号也是一种方式，但建议统一版本号

### 3.3 启动原生模块的自动链接

```

//settings.gradle文件配置
apply from: file("../node_modules/@react-native-community/cli-platform-android/native_modules.gradle"); applyNativeModulesSettingsGradle(settings)

//app/build.gradle中配置
apply from: file("../../node_modules/@react-native-community/cli-platform-android/native_modules.gradle"); applyNativeModulesAppBuildGradle(project)

```

### 3.4 配置权限

```xml
//AndroidManifest.xml配置

<uses-permission android:name="android.permission.INTERNET" />

application标签添加android:networkSecurityConfig="@xml/network_security_config"

//开发者菜单配置
<activity android:name="com.facebook.react.devsupport.DevSettingsActivity" />


//允许http接口（从 Android 9 (API level 28)开始，默认情况下明文传输（http 接口）是禁用的，只能访问 https 接口。这将阻止应用程序连接到Metro bundler）
<!-- ... -->
<application
  android:usesCleartextTraffic="true" tools:targetApi="28" >
  <!-- ... -->
</application>

```

network_security_config.xml文件内容：

```xml
<?xml version="1.0" encoding="utf-8"?>
<network-security-config xmlns:android="http://schemas.android.com/apk/res/android">
    <debug-overrides cleartextTrafficPermitted="true">
        <trust-anchors>
            <certificates src="user"/>
            <certificates src="system"/>
        </trust-anchors>
    </debug-overrides>

    <base-config cleartextTrafficPermitted="true" />
</network-security-config>
```


## 4. 代码集成

### 4.1 创建自定义ReactActivity

```Java
package com.lqd.androidpractice.rn;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.Settings;
import android.util.Log;
import android.view.KeyEvent;

import androidx.annotation.Nullable;

import com.facebook.react.PackageList;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactPackage;
import com.facebook.react.ReactRootView;
import com.facebook.react.common.LifecycleState;
import com.facebook.react.devsupport.RedBoxHandler;
import com.facebook.react.devsupport.interfaces.StackFrame;
import com.facebook.react.modules.core.DefaultHardwareBackBtnHandler;
import com.facebook.soloader.SoLoader;
import com.lqd.androidpractice.BuildConfig;

import java.util.List;

public class MyReactActivity extends Activity implements DefaultHardwareBackBtnHandler {

    private ReactRootView mReactRootView;
    private ReactInstanceManager mReactInstanceManager;

    private final int OVERLAY_PERMISSION_REQ_CODE = 1;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Log.w("MyReactActivity", "onCreate>>>>>>>>>>>>>>>>>>>>>>>>");

        //获取权限
        if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if(!Settings.canDrawOverlays(this)) {
                Intent intent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION, Uri.parse("package:" + getPackageName()));
                startActivityForResult(intent, OVERLAY_PERMISSION_REQ_CODE);
            }
        }

        SoLoader.init(this, false);
        mReactRootView = new ReactRootView(this);
        List<ReactPackage> packages = new PackageList(getApplication()).getPackages();
//        packages.add(new MyReactNativePackage());
        packages.add(new IndexPackage());//自定义的Package

        mReactInstanceManager = ReactInstanceManager.builder()
                //设置上下文
                .setApplication(getApplication())
                .setCurrentActivity(this)
                //设置js产物的名字
                .setBundleAssetName("index.android.bundle")
                //JS bundle主入口的文件名，js文件的名字
                .setJSMainModulePath("index")
                .addPackages(packages)//注册自定义的Package
                .setUseDeveloperSupport(BuildConfig.DEBUG)
                //设置创建时机
                .setInitialLifecycleState(LifecycleState.RESUMED)
                //JS异常回调
                .setRedBoxHandler(new MyRedBoxHandler())
                .build();

        //这里的名字与AppRegistry.registerComponent对应
        mReactRootView.startReactApplication(mReactInstanceManager, "MyReactNativeApp", null);

        setContentView(mReactRootView);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        if(resultCode == OVERLAY_PERMISSION_REQ_CODE) {
            if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                if(!Settings.canDrawOverlays(this)) {

                }
            }
        }
        mReactInstanceManager.onActivityResult(this, requestCode, resultCode, data);
    }

    @Override
    public boolean onKeyUp(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_MENU && mReactInstanceManager != null) {
            mReactInstanceManager.showDevOptionsDialog();
            return true;
        }

        return super.onKeyUp(keyCode, event);
    }

    @Override
    public void invokeDefaultOnBackPressed() {
        super.onBackPressed();
    }

    @Override
    public void onBackPressed() {
        if (mReactInstanceManager != null) {
            mReactInstanceManager.onBackPressed();
        } else {
            super.onBackPressed();
        }
    }

    //生命周期回调同步
    @Override
    protected void onPause() {
        super.onPause();

        if (mReactInstanceManager != null) {
            mReactInstanceManager.onHostPause(this);
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (mReactInstanceManager != null) {
            mReactInstanceManager.onHostResume(this, this);
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (mReactInstanceManager != null) {
            mReactInstanceManager.onHostDestroy(this);
        }

        if (mReactRootView != null) {
            mReactRootView.unmountReactApplication();
        }
    }


}

/**
 * 异常信息的回调
 */
class MyRedBoxHandler implements RedBoxHandler {
    @Override
    public void handleRedbox(@Nullable String title, StackFrame[] stack, ErrorType errorType) {

        for(StackFrame stackFrame : stack) {
            Log.w("MyReactActivity", "=====handleRedbox   " + stackFrame.getMethod() + " " + stackFrame.getFileName() + " " + stackFrame.getLine() + " " + stackFrame.getColumn() + "  ");
        }
        //JS异常
        Log.w("MyReactActivity", ">>handleRedbox   " + title + "---------------- " + errorType + "  ");
    }

    @Override
    public boolean isReportEnabled() {
        return true;
    }

    @Override
    public void reportRedbox(Context context, String title, StackFrame[] stack, String sourceUrl, ReportCompletedListener reportCompletedListener) {
        Log.w("MyReactActivity", "-----handleRedbox   " + title + " sourceUrl:" + sourceUrl + "  ");
    }
}
```


### 4.2 创建自定义Package

IndexPackage.java文件

```Java

package com.lqd.androidpractice.rn;

import androidx.annotation.NonNull;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

//Package用于将原生模块和视图管理器添加到RN中
public class IndexPackage implements ReactPackage {

  //返回原生模块列表
    @NonNull
    @Override
    public List<NativeModule> createNativeModules(@NonNull ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();
        modules.add(new IndexModule(reactContext));
        return modules;
    }

//返回包含原生视图管理器的列表
    @NonNull
    @Override
    public List<ViewManager> createViewManagers(@NonNull ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }
}


```

IndexModule.java文件

```Java
package com.lqd.androidpractice.rn;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;

public class IndexModule extends ReactContextBaseJavaModule {

    public IndexModule(@NonNull ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @NonNull
    @Override
    public String getName() {
        return "index";//跟index.js对应
    }

    @Override
    public void onCatalystInstanceDestroy() {
        super.onCatalystInstanceDestroy();
    }
}

```

### 4.3 创建index.js文件

```JavaScript
import React from 'react';
import {
    AppRegistry,
    Button,
    Style,
    Text,
    View
} from 'react-native';
//import ToastExample from './ToastExample';


class HelloWorld extends React.Component {
    render() {
        return (
            <View>
                <Text>Hello, World</Text>
            </View>
        );
    }
}

AppRegistry.registerComponent('MyReactNativeApp', () => HelloWorld);

```


> React Native也封装了一个ReactActivity，直接继承它更方便

```Java
public class RNActivity1 extends ReactActivity implements PermissionAwareActivity, DefaultHardwareBackBtnHandler {


    protected String getMainComponentName() {
        return "index";
    }


    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {

        return new ReactActivityDelegate(this, getMainComponentName()) {
            @Nullable
            @Override
            public String getMainComponentName() {
                return "index";
            }
        };
    }
}

//使用这种方式Application需要实现ReactApplication，实现getReactNativeHost方法，将对应的Package进行注册
public class LQDApplication extends Application implements ReactApplication {

    @Override
    public ReactNativeHost getReactNativeHost() {
        return new ReactNativeHost(this) {
            @Override
            public boolean getUseDeveloperSupport() {
                return false;
            }

            @Override
            protected List<ReactPackage> getPackages() {
                List<ReactPackage> packages = new PackageList(getApplication()).getPackages();
                packages.add(new IndexPackage());
                packages.add(new ImagePickerPackage());
                return packages;
            }
        };
    }
    
}

```


### 4.4 编译bundle

```shell
npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res

```

> 开发环境会自动编译bundle？



## 5. 运行Android端




```shell
#开发环境时调试
#1.先启动Metro服务器
#如果自定义端口，则需要在开发者菜单中配置对应的ip:port
npm run start --verbose -- --port 8088 
#或yarn start

#2.运行程序
yarn react-native run-android


#3.打开开发者工具，配置ip:port


#生产环境
#通过codepush进行热更新或者编译bundle到assets目录下
```





## 问题总结

### 找不到PackageList

这个文件是生成的，删除build文件夹，执行以下yarn react-native run-android


## 参考

- [集成到现有原生应用](https://reactnative.cn/docs/integration-with-existing-apps)