---
title: 编译QtWebEngine
tags: Qt QtWebEngine
---

由于QtWebEngine本身并不支持H.264编码的音视频，现自行编译，整个过程如下：

### 依赖准备

VS2015 **Update3**

- [下载地址](https://docs.microsoft.com/en-us/visualstudio/releasenotes/vs2015-update3-vs)

安装Qt 5.10.1：`安装的时候选择带源码`

- [下载地址](http://qt.mirror.constant.com/archive/qt/5.10/5.10.1/submodules/)

安装Python 2.7.5以上版本

- [下载地址](https://www.python.org/downloads/windows/)


Perl

- [下载地址](http://strawberryperl.com/)

Bison和Flex

- [下载地址](https://sourceforge.net/projects/winflexbison/)

Gperf

- [下载地址](http://gnuwin32.sourceforge.net/packages/gperf.htm)

Windows SDK

- **要求10.0.10586版本以上**

<br/>

### 环境准备

如果出现以下问题，则将系统语言设置为英文

```
ninja: build stopped: subcommand failed. NMAKE : fatal error U1077: 'call' : return code '0x1' Stop. NMAKE : fatal error U1077: '"C:\Program Files (x86)\Microsoft Visual Studio\2017\Community\VC\Tools\MSVC\14.14.26428\bin\HostX64\x64\nmake.exe"' : return code '0x2' Stop. NMAKE : fatal error U1077: '(' : return code '0x2' Stop. NMAKE : fatal error U1077: 'cd' : return code '0x2' Stop. NMAKE : fatal error U1077: 'cd' : return code '0x2' Stop 
```



<br/>

### 编译

    rem 运行VC环境
    "D:\Program Files (x86)\Microsoft Visual Studio 14.0\VC\bin\vcvars32.bat"
    set PYTHON_PATH=D:\Python\Python27-32
    set PERL_PATH=E:\Perl\bin
    set Bison_Flex_PATH=D:\Qt\Qt5.10.1\5.10.1\build_depends\win_flex_bison
    set Gperf_PATH=D:\Qt\Qt5.10.1\5.10.1\build_depends\gperf-3.0.1-bin\bin
    set PATH=%PYTHON_PATH%;%PERL_PATH%;%Bison_Flex_PATH%;%Gperf_PATH%;%PATH%
    rem 配置
    "D:\Qt\Qt5.10.1\5.10.1\msvc2015\bin\qmake.exe" -- -webengine-proprietary-codecs
    rem 编译、安装
    nmake && namek install


<br/>

![](/public/files/qtwebengine_1.png)

<br/>



**参考**

- [https://wiki.qt.io/Building_Qt_5_from_Git](https://wiki.qt.io/Building_Qt_5_from_Git)
- [http://doc.qt.io/qt-5/build-sources.html](http://doc.qt.io/qt-5/build-sources.html)
- [http://doc.qt.io/qt-5/windows-requirements.html](http://doc.qt.io/qt-5/windows-requirements.html)
- [https://www.pressc.cn/1044.html](https://www.pressc.cn/1044.html)
- [https://blog.afach.de/?page_id=399](https://blog.afach.de/?page_id=399)
