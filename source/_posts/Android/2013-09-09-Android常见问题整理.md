---
title: Android常见问题整理
tags: Android
---



### 问题描述

```
!SESSION 2017-08-29 15:27:40.107 ----------------------------------------------- 
eclipse.buildId=unknown java.version=1.8.0_112-release java.vendor=JetBrains s.r.o BootLoader constants: OS=win32, ARCH=x86_64, WS=win32, NL=zh_CN Command-line arguments: -os win32 -ws win32 -arch x86_64 -data @noDefault
...
 !ENTRY org.eclipse.osgi 4 0 2017-08-29 15:27:41.441 
 !MESSAGE Application error !STACK 1 java.lang.NullPointerException 
 at org.eclipse.core.runtime.URIUtil.toURI(URIUtil.java:280) 
 at org.eclipse.e4.ui.internal.workbench.ResourceHandler.loadMostRecentModel(ResourceHandler.java:127)
...
```

### 解决办法

1. 进程管理器中杀死monitor.exe进程；
2. 删除$HOME/.android/monitor-workspace目录

### 参考

- [https://tutel.me/c/programming/questions/26052849/unexpected+error+while+parsing+input+invalid+uiautomator+hierarchy+file](https://tutel.me/c/programming/questions/26052849/unexpected+error+while+parsing+input+invalid+uiautomator+hierarchy+file)

----



### 问题描述

```
* What went wrong:
Execution failed for task ':app:transformDexArchiveWithExternalLibsDexMergerForDebug'.
> com.android.builder.dexing.DexArchiveMergerException: Error while merging dex archives: 
  Program type already present: org.intellij.lang.annotations.Identifier
  Learn how to resolve the issue at https://developer.android.com/studio/build/dependencies#duplicate_classes.
```

### 解决办法

    android {
        configurations {
            cleanedAnnotations
            compile.exclude group: 'org.jetbrains' , module:'annotations'
        }
    }

### 参考

- [https://stackoverflow.com/questions/49811851/program-type-already-present-org-intellij-lang-annotations-flow](https://stackoverflow.com/questions/49811851/program-type-already-present-org-intellij-lang-annotations-flow)

----



### 问题描述

```
Error:Execution failed for task ':app:javaPreCompilePreProductDebug'. > Annotation processors must be explicitly declared now. The following dependencies on the compile classpath are found to contain annotation processor. Please add them to the annotationProcessor configuration.
```

### 解决办法

    android {
        javaCompileOptions {
            annotationProcessorOptions {
                includeCompileClasspath true
            }
        }
    }

### 参考


----





### 问题描述

```
FAILURE: Build failed with an exception.

* What went wrong:
A problem occurred configuring project ':myProject'.
> Could not resolve all files for configuration ':myProject:classpath'.
> Could not find org.jetbrains.trove4j:trove4j:20160824.
    Searched in the following locations:
```

### 解决办法

找不到依赖，添加仓库地址。

    buildscript {
        repositories {
            google()
            jcenter()
            maven { url "https://jitpack.io" }
            mavenCentral()
        }
        dependencies {
            classpath 'com.android.tools.build:gradle:3.3.2'
        }
    }

    allprojects {
        repositories {    
            google()
            jcenter()
            mavenCentral()
            maven { url "https://jitpack.io" }
        }
    }

### 参考

- [https://blog.csdn.net/rooney8/article/details/86065188](https://blog.csdn.net/rooney8/article/details/86065188)

----



### 问题描述

```
Android-SDK/ndk-bundle/build/core/add-application.mk:178: ### * Android NDK: APP_STL gnustl_shared is no longer supported. Please switch to either c++_static or c++_shared. See https://developer.android.com/ndk/guides/cpp-support.html for more information. . Stop.
```

### 解决办法

修改项目中Application.mk文件，将其中的APP_STL := gnustl_static改成APP_STL := c++_static

### 参考

- [https://stackoverflow.com/questions/52475177/android-ndk-app-stl-gnustl-shared-is-no-longer-supported](https://stackoverflow.com/questions/52475177/android-ndk-app-stl-gnustl-shared-is-no-longer-supported)



### 问题描述

```
This Activity already has an action bar supplied by the window decor. Do not request Window.FEATURE_SUPPORT_ACTION_BAR and set windowActionBar to false in your theme to use a Toolbar instead.
```

### 解决办法

修改主题属性

### 参考

- [https://my.oschina.net/ocean870227/blog/738442](https://my.oschina.net/ocean870227/blog/738442)
