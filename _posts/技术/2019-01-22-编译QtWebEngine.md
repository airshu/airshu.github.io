---
layout: post
title: 编译QtWebEngine
category: 技术
tags: 技术 Qt
keywords:
description:
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

将系统语言设置为英文

<br/>

### 编译

    "D:\Program Files (x86)\Microsoft Visual Studio 14.0\VC\bin\vcvars32.bat"
    set PYTHON_PATH=D:\Python\Python27-32
    set PERL_PATH=E:\Perl\bin
    set Bison_Flex_PATH=D:\Qt\Qt5.10.1\5.10.1\build_depends\win_flex_bison
    set Gperf_PATH=D:\Qt\Qt5.10.1\5.10.1\build_depends\gperf-3.0.1-bin\bin
    set PATH=%PYTHON_PATH%;%PERL_PATH%;%Bison_Flex_PATH%;%Gperf_PATH%;%PATH%
    "D:\Qt\Qt5.10.1\5.10.1\msvc2015\bin\qmake.exe" -- -webengine-proprietary-codecs
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
