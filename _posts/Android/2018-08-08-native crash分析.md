---
layout: post
title: native crash 分析
category: Android
tags: Android
keywords: Android
description: 
---


**Crash类型：**

- Framework/App Crash：Java层崩溃
- Native Crash：C/C++层崩溃
- Kernel Crash：内核崩溃


### **tombstone文件的组成部分：**

- Build fingerprint
- Crashed process and PIDS
- Terminated signal and fault address
- CPU registers
- Call stack
- Stack content of each call

```
--logversion:utracea
Process Name: 'com.feiteng.lieyou'
Thread Name: 'RenderThread'
pid: 25031, tid: 25237 >>> com.feiteng.lieyou <<<
killed by pid: 25031, comm: .feiteng.lieyou, uid: 10125.
signal 6 (SIGABRT), code -6 (SI_TKILL), fault addr --------
r0 00000000 r1 00006295 r2 00000006 r3 00000008
r4 c587c978 r5 00000006 r6 c587c920 r7 0000010c
r8 bf249bc8 r9 00000000 10 bf249bbc fp bf249bb8
ip 00000004 sp c587c3b0 lr eba21907 pc eba24188 cpsr 20070010
d0 0000000000000000 d1 0000000000000000
d2 0000000000000000 d3 0000000000000000

```

<b>signal指定异常类型。如果pid等于tid，则说明程序是在主线程中崩溃。</b>

**信号类型:**


```C++
#define SIGHUP 1  // 终端连接结束时发出(不管正常或非正常)
#define SIGINT 2  // 程序终止(例如Ctrl-C)
#define SIGQUIT 3 // 程序退出(Ctrl-\)
#define SIGILL 4 // 执行了非法指令，或者试图执行数据段，堆栈溢出
#define SIGTRAP 5 // 断点时产生，由debugger使用
#define SIGABRT 6 // 调用abort函数生成的信号，表示程序异常
#define SIGIOT 6 // 同上，更全，IO异常也会发出
#define SIGBUS 7 // 非法地址，包括内存地址对齐出错，比如访问一个4字节的整数, 但其地址不是4的倍数
#define SIGFPE 8 // 计算错误，比如除0、溢出
#define SIGKILL 9 // 强制结束程序，具有最高优先级，本信号不能被阻塞、处理和忽略
#define SIGUSR1 10 // 未使用，保留
#define SIGSEGV 11 // 非法内存操作，与SIGBUS不同，他是对合法地址的非法访问，比如访问没有读权限的内存，向没有写权限的地址写数据
#define SIGUSR2 12 // 未使用，保留
#define SIGPIPE 13 // 管道破裂，通常在进程间通信产生
#define SIGALRM 14 // 定时信号,
#define SIGTERM 15 // 结束程序，类似温和的SIGKILL，可被阻塞和处理。通常程序如果终止不了，才会尝试SIGKILL
#define SIGSTKFLT 16  // 协处理器堆栈错误
#define SIGCHLD 17 // 子进程结束时, 父进程会收到这个信号。
#define SIGCONT 18 // 让一个停止的进程继续执行
#define SIGSTOP 19 // 停止进程,本信号不能被阻塞,处理或忽略
#define SIGTSTP 20 // 停止进程,但该信号可以被处理和忽略
#define SIGTTIN 21 // 当后台作业要从用户终端读数据时, 该作业中的所有进程会收到SIGTTIN信号
#define SIGTTOU 22 // 类似于SIGTTIN, 但在写终端时收到
#define SIGURG 23 // 有紧急数据或out-of-band数据到达socket时产生
#define SIGXCPU 24 // 超过CPU时间资源限制时发出
#define SIGXFSZ 25 // 当进程企图扩大文件以至于超过文件大小资源限制
#define SIGVTALRM 26 // 虚拟时钟信号. 类似于SIGALRM, 但是计算的是该进程占用的CPU时间.
#define SIGPROF 27 // 类似于SIGALRM/SIGVTALRM, 但包括该进程用的CPU时间以及系统调用的时间
#define SIGWINCH 28 // 窗口大小改变时发出
#define SIGIO 29 // 文件描述符准备就绪, 可以开始进行输入/输出操作
#define SIGPOLL SIGIO // 同上，别称
#define SIGPWR 30 // 电源异常
#define SIGSYS 31 // 非法的系统调用
```

tombstone 文件位于路径 /data/tombstones/下


**调用栈信息**

调用栈信息是分析程序崩溃的非常重要的一个信息，它主要记录了程序在 Crash 前的函数调用关系以及当前正在执行函数的信息，它对应的是我们 tombstone 文件中 backtrace 符号开始的信息，上面例子中的 backtrace 的信息如下所示

```
backtrace:
    #00 pc 00006639  /system/lib/libui.so (android::Fence::waitForever(char const*)+41)
    #01 pc 00034b86  /system/lib/libsurfaceflinger.so
    #02 pc 0003229e  /system/lib/libsurfaceflinger.so
    #03 pc 0002cb9c  /system/lib/libgui.so (android::BufferQueue::ProxyConsumerListener::onFrameAvailable(android::BufferItem const&)+652)
    #04 pc 000342f4  /system/lib/libgui.so (android::BufferQueueProducer::queueBuffer(int, android::IGraphicBufferProducer::QueueBufferInput const&, android::IGraphicBufferProducer::QueueBufferOutput*)+2580)

    ##00 等表示函数调用栈中栈帧的编号
    pc 后面的16进制数表示当前函数正在执行语句在共享链接库或可执行文件的位置
    最后一行表示当前指令在哪个文件
```

### 如何定位崩溃位置

#### 常用工具


**nm**

```
查看动态库的符号表
nm -D libName.so | grep symbel symbolName
```

**addr2line**

```
Usage: /Users/loneqd/Android/sdk/ndk-bundle/toolchains/aarch64-linux-android-4.9/prebuilt/darwin-x86_64/bin/aarch64-linux-android-addr2line [option(s)] [addr(s)]
 Convert addresses into line number/file name pairs.
 If no addresses are specified on the command line, they will be read from stdin
 The options are:
  @<file>                Read options from <file>
  -a --addresses         Show addresses
  -b --target=<bfdname>  Set the binary file format
  -e --exe=<executable>  Set the input file name (default is a.out)
  -i --inlines           Unwind inlined functions
  -j --section=<name>    Read section-relative offsets instead of addresses
  -p --pretty-print      Make the output easier to read for humans
  -s --basenames         Strip directory names
  -f --functions         Show function names
  -C --demangle[=style]  Demangle function names
  -h --help              Display this information
  -v --version           Display the program's version

实例：(需使用带symbol的动态库)
addr2line -f -e libui.so 00006639 _ZN7android5Fence11waitForeverE  
```




**ndk-stack**

将崩溃时的调用内存地址和C++代码对应起来

```
usage: ndk-stack.py [-h] -sym SYMBOL_DIR [-i INPUT]

Symbolizes Android crashes.

optional arguments:
  -h, --help            show this help message and exit
  -sym SYMBOL_DIR, --sym SYMBOL_DIR
                        directory containing unstripped .so files
  -i INPUT, -dump INPUT, --dump INPUT
                        input filename

See <https://developer.android.com/ndk/guides/ndk-stack>.

sym指项目编译成功之后，obj目录
dump指崩溃文件
```

### 参考

- [http://gityuan.com/2016/06/25/android-native-crash/](http://gityuan.com/2016/06/25/android-native-crash/)
- [https://toutiao.io/posts/jflx6c/preview](https://toutiao.io/posts/jflx6c/preview)
- [https://source.android.google.cn/devices/tech/debug/native-crash?hl=zh-cn](https://source.android.google.cn/devices/tech/debug/native-crash?hl=zh-cn)
- [http://www.droidsec.cn/%E5%B8%B8%E8%A7%81android-native%E5%B4%A9%E6%BA%83%E5%8F%8A%E9%94%99%E8%AF%AF%E5%8E%9F%E5%9B%A0/](http://www.droidsec.cn/%E5%B8%B8%E8%A7%81android-native%E5%B4%A9%E6%BA%83%E5%8F%8A%E9%94%99%E8%AF%AF%E5%8E%9F%E5%9B%A0/)
- [https://github.com/iqiyi/xCrash](https://github.com/iqiyi/xCrash)
- [https://source.android.com/devices/tech/debug](https://source.android.com/devices/tech/debug)